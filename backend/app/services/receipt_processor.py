import io
import pytesseract
from PIL import Image
import imagehash
from fastapi import HTTPException, status
import magic

# Configure Tesseract path if needed
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class ReceiptProcessor:
    @staticmethod
    def validate_image(file: bytes):
        """Validate the uploaded file is an image"""
        # Check file type using magic numbers
        file_type = magic.from_buffer(file, mime=True)
        if not file_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is not a valid image"
            )
        
        # Check file size (max 10MB)
        if len(file) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds 10MB limit"
            )
        
        return True
    
    @staticmethod
    def generate_image_hash(image_data: bytes) -> str:
        """Generate a perceptual hash for the image"""
        try:
            image = Image.open(io.BytesIO(image_data))
            # Convert to grayscale and resize for consistent hashing
            image = image.convert("L").resize((32, 32), Image.Resampling.LANCZOS)
            # Generate perceptual hash
            return str(imagehash.phash(image))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to process image: {str(e)}"
            )
    
    @staticmethod
    def extract_text(image_data: bytes) -> str:
        """Extract text from receipt image using OCR"""
        try:
            image = Image.open(io.BytesIO(image_data))
            # Preprocess image for better OCR results
            image = image.convert('L')  # Convert to grayscale
            # Run OCR
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OCR processing failed: {str(e)}"
            )
    
    @staticmethod
    def parse_receipt_data(ocr_text: str) -> dict:
        """Parse OCR text to extract receipt data"""
        # This is a simplified parser - you'll want to enhance this based on your needs
        lines = [line.strip() for line in ocr_text.split('\n') if line.strip()]
        
        # Simple heuristics to find merchant and total
        merchant = lines[0] if lines else "Unknown Merchant"
        total = 0.0
        
        # Look for total amount (simplified)
        for line in reversed(lines):
            line = line.lower()
            if 'total' in line:
                # Extract numbers from the line
                numbers = [float(s.replace(',', '')) for s in line.split() 
                         if s.replace('.', '').replace(',', '').isdigit()]
                if numbers:
                    total = max(numbers)  # Assuming the largest number is the total
                    break
        
        return {
            "merchant": merchant,
            "total": total,
            "raw_text": ocr_text,
            "item_count": len([line for line in lines if line and any(c.isdigit() for c in line)])
        }
