from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any

class ReceiptBase(BaseModel):
    merchant_name: Optional[str] = None
    total_amount: float
    transaction_date: Optional[datetime] = None
    extracted_data: Optional[Dict[str, Any]] = {}

class ReceiptCreate(ReceiptBase):
    user_id: int
    receipt_hash: str
    ocr_text: Optional[str] = None

class Receipt(ReceiptBase):
    id: int
    user_id: int
    created_at: datetime
    receipt_hash: str
    ocr_text: Optional[str] = None
    extracted_data: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
