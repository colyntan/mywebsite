from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from .database import Base

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    merchant_name = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    transaction_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    receipt_hash = Column(String(64), unique=True, nullable=False)
    ocr_text = Column(Text, nullable=True)
    extracted_data = Column(JSON, nullable=True)

    def __repr__(self):
        return f"<Receipt(id={self.id}, merchant='{self.merchant_name}', total={self.total_amount})>"
