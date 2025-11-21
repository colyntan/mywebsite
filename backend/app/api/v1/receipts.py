from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import io

from app import models, schemas, crud
from app.database import get_db
from app.services.receipt_processor import ReceiptProcessor

router = APIRouter()

@router.post("/upload/", response_model=schemas.Receipt)
async def upload_receipt(
    file: UploadFile = File(...),
    user_id: int = 1,  # In a real app, get this from auth token
    db: Session = Depends(get_db)
):
    # Read file content
    contents = await file.read()
    
    # Initialize processor
    processor = ReceiptProcessor()
    
    # Validate image
    processor.validate_image(contents)
    
    # Generate image hash for deduplication
    receipt_hash = processor.generate_image_hash(contents)
    
    # Check for duplicate
    if crud.get_receipt_by_hash(db, receipt_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This receipt has already been uploaded"
        )
    
    # Process receipt
    ocr_text = processor.extract_text(contents)
    receipt_data = processor.parse_receipt_data(ocr_text)
    
    # Create receipt in database
    receipt_in = schemas.ReceiptCreate(
        user_id=user_id,
        merchant_name=receipt_data.get("merchant"),
        total_amount=receipt_data.get("total"),
        receipt_hash=receipt_hash,
        ocr_text=ocr_text,
        extracted_data=receipt_data
    )
    
    db_receipt = crud.create_receipt(db, receipt_in)
    return db_receipt

@router.get("/", response_model=List[schemas.Receipt])
def list_receipts(
    user_id: int = 1,  # In a real app, get this from auth token
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all receipts for the current user"""
    receipts = crud.get_receipts(db, user_id=user_id, skip=skip, limit=limit)
    return receipts

@router.get("/{receipt_id}", response_model=schemas.Receipt)
def get_receipt(
    receipt_id: int,
    user_id: int = 1,  # In a real app, get this from auth token
    db: Session = Depends(get_db)
):
    """Get a specific receipt by ID"""
    receipt = crud.get_receipt(db, receipt_id=receipt_id)
    if receipt is None:
        raise HTTPException(status_code=404, detail="Receipt not found")
    if receipt.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this receipt")
    return receipt

@router.delete("/{receipt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_receipt(
    receipt_id: int,
    user_id: int = 1,  # In a real app, get this from auth token
    db: Session = Depends(get_db)
):
    """Delete a receipt"""
    receipt = crud.get_receipt(db, receipt_id=receipt_id)
    if receipt is None:
        raise HTTPException(status_code=404, detail="Receipt not found")
    if receipt.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this receipt")
    crud.delete_receipt(db, receipt_id=receipt_id)
    return {"status": "success", "message": "Receipt deleted"}
