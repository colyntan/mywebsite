from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def get_receipt(db: Session, receipt_id: int):
    return db.query(models.Receipt).filter(models.Receipt.id == receipt_id).first()

def get_receipts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Receipt).filter(models.Receipt.user_id == user_id).offset(skip).limit(limit).all()

def get_receipt_by_hash(db: Session, receipt_hash: str):
    return db.query(models.Receipt).filter(models.Receipt.receipt_hash == receipt_hash).first()

def create_receipt(db: Session, receipt: schemas.ReceiptCreate):
    db_receipt = models.Receipt(**receipt.model_dump())
    db.add(db_receipt)
    db.commit()
    db.refresh(db_receipt)
    return db_receipt

def delete_receipt(db: Session, receipt_id: int):
    db_receipt = get_receipt(db, receipt_id)
    if db_receipt:
        db.delete(db_receipt)
        db.commit()
        return True
    return False

def get_user_receipts(db: Session, user_id: int):
    return db.query(models.Receipt).filter(models.Receipt.user_id == user_id).order_by(models.Receipt.transaction_date.desc()).all()
