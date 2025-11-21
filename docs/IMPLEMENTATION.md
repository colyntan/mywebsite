# IMPLEMENTATION.md – Blueberry Garden

## 1. Scope & Goals (Current Project)

- **Primary focus** Build the *Personal Finance Suite – Receipt Processor* as a solid Phase 1 foundation that can later plug into Expense Calculator, Fitness Tracker, and the AI Assistant.
- **MVP goals**
  - **Upload receipts** via web UI.
  - **Extract transaction data** from images/PDFs (merchant, date, total, line items).
  - **Store receipts** in PostgreSQL under the unified `User` model.
  - **Basic expense tracking** (view, filter, categorize receipts).
- **Non-goals (for now)**
  - Advanced budgeting, forecasting, or ML-based categorization.
  - Full fitness tracking and AI preference learning (only plan integration points).

---

## 2. Backend Implementation (FastAPI + PostgreSQL)

### 2.1 Project Structure

Follow the architecture skeleton:

```text
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── finance/
│   │   │   ├── fitness/
│   │   │   ├── ai/
│   │   │   └── users/
│   ├── models/
│   ├── services/
│   └── core/
└── tests/
```

- **Initial focus** Implement only `users/` and `finance/` API modules plus the shared `core/` and `models/`.

### 2.2 Core Layer

- **`core/config.py`**
  - **Config management** Use Pydantic `BaseSettings` for environment-driven config (DB URL, JWT secret, CORS origins, external OCR keys).
- **`core/database.py`**
  - **DB setup** SQLAlchemy `engine`, `SessionLocal`, `Base`.
  - **Migrations** Use Alembic for schema evolution.
- **`core/security.py`**
  - **Auth utilities** Password hashing (e.g., `passlib`), JWT creation/verification, dependency for `current_user`.

### 2.3 Models

Based on `ARCHITECTURE.md`, extend finance models:

```python
# app/models/user.py
class User(Base):
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    preferences = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
```

```python
# app/models/finance.py
class Receipt(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    merchant = Column(String)
    total = Column(Float)
    date = Column(DateTime)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("ReceiptItem", back_populates="receipt")

class ReceiptItem(Base):
    id = Column(Integer, primary_key=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"))
    description = Column(String)
    quantity = Column(Float)
    unit_price = Column(Float)
    category = Column(String)

    receipt = relationship("Receipt", back_populates="items")
```

Future models (Budget, Workout, UserPreference) stay as in `ARCHITECTURE.md` but can be added after Phase 1.

### 2.4 Services

- **`services/receipt_processor.py`**
  - **Input** Image/PDF or extracted text.
  - **Steps**
    - **OCR** Use either:
      - Local Tesseract via `pytesseract`, or
      - Cloud OCR API (e.g., Google Vision / Azure Cognitive Services) behind a clean interface.
    - **Parsing** Regex + rule-based parsing for:
      - Merchant name.
      - Date and total.
      - Line items (description, quantity, price).
    - **Normalization** Standardize dates, currency, and decimals.
    - **Persistence** Create `Receipt` + `ReceiptItem` rows.
- **`services/expense_analyzer.py`** (Phase 1: minimal)
  - **Rules** Map merchants or keywords to a static set of categories (e.g., "Groceries", "Dining").
  - **Later** Replace with ML classifier when AI module matures.

### 2.5 API Endpoints (Phase 1)

All under `app/api/v1/finance/`:

- **`POST /api/v1/finance/receipts/upload`**
  - **Body** Multipart form with file and optional manual metadata.
  - **Behavior**
    - Validate file type/size.
    - Call `receipt_processor.process(file)`.
    - Return stored `Receipt` with items.
- **`GET /api/v1/finance/receipts`**
  - **Query params** `start_date`, `end_date`, `category`, `merchant`, `limit`, `offset`.
  - **Behavior** List paginated receipts for authenticated user.
- **`GET /api/v1/finance/receipts/{id}`**
  - **Behavior** Fetch one receipt with items.
- **`PATCH /api/v1/finance/receipts/{id}`**
  - **Behavior** Allow manual edits to `merchant`, `date`, `category`, and line items.
- **`GET /api/v1/finance/summary`**
  - **Behavior** Aggregate spending by category and month for basic charts.

User endpoints under `app/api/v1/users/`:

- **`POST /api/v1/users/register`**, **`POST /api/v1/users/login`**
  - Email/password auth with JWT tokens.
- **`GET /api/v1/users/me`**
  - Return profile and high-level preferences.

---

## 3. Frontend Implementation (Receipt Processor)

Assuming current project is a static site that will gradually move toward a React-based SPA.

### 3.1 Initial Integration (Static/Vanilla JS)

- **Upload UI**
  - **Features**
    - Drag-and-drop or file input.
    - Progress indicator during upload.
    - Error display for invalid files.
  - **Implementation**
    - Use existing `receiptproject.html` and `receipt-processor-new.js`.
    - Add `fetch` POST call to `/api/v1/finance/receipts/upload`.
- **Receipt list + detail**
  - **Features**
    - List of recent receipts.
    - Click to expand and see items.
  - **Implementation**
    - Simple table or list rendered from `/api/v1/finance/receipts`.
- **Filters**
  - **Features**
    - Date range, category filter.
  - **Implementation**
    - Update query params in `fetch` calls and re-render the table.

### 3.2 React Migration (Optional Near-Term Step)

- **New app** `frontend/` with React.
- **Pages/Views**
  - **Receipt Dashboard** summary charts + receipt list.
  - **Receipt Detail** editable table for line items.
- **State management**
  - **Local or Context API** for now (Redux later if needed).
- **API layer**
  - `apiClient.ts` for typed wrappers around auth + finance endpoints.

---

## 4. Phase-Based Roadmap (Tied to Architecture)

### 4.1 Phase 1 – Foundation (Receipt Processor + Basic Tracking)

- **Backend**
  - **Implement** `User`, `Receipt`, `ReceiptItem` models.
  - **Implement** authentication, upload, receipt listing, and summary endpoints.
- **Frontend**
  - **Wire up** upload UI and receipt list to backend.
  - **Provide** basic filters and manual category editing.

### 4.2 Phase 2 – Core Features

- **Budget management**
  - **Add** `Budget` model and endpoints (`/api/v1/finance/budgets`).
  - **Add** front-end budget editor and budget-vs-actual views.
- **Workout logging**
  - **Implement** `Workout` and `Exercise` models and REST endpoints under `fitness/`.
  - **Create** simple UI to log workouts and view history.
- **Basic AI recommendations**
  - **Implement** `UserPreference` model and minimal rules-based recommendations using existing finance/fitness data.
  - **Expose** `/api/v1/ai/recommendations` and show them on dashboard.

### 4.3 Phase 3 – Advanced Features

- **AI preference learning**
  - **Implement** training jobs (e.g., nightly) that update `UserPreference` weights based on behavior.
- **Cross-feature insights**
  - **Compute** correlations between spending, workout consistency, and goals.
  - **Expose** richer insights via the AI assistant endpoints and UI.
- **Mobile & Wearables**
  - **Add** API tokens and simplified endpoints suitable for mobile/IoT clients.

---

## 5. Technical & Operational Considerations

- **Security**
  - **Enforce** JWT-based auth on all non-public endpoints.
  - **Restrict** file sizes/types and scan uploads where possible.
- **Testing**
  - **Unit tests** for `receipt_processor` parsing with sample receipts.
  - **Integration tests** for upload → DB persistence → listing flow.
- **Deployment**
  - **Dockerize** backend (`Dockerfile`) with FastAPI + Uvicorn.
  - **Use** GitHub Actions for CI:
    - Run tests and lint on PRs.
    - Build/push Docker images.
  - **Host** backend on Railway and frontend on Vercel as per architecture.

---

### Status

- **This document** provides a concrete implementation path for the current Receipt Processor project and its evolution into the broader Blueberry Garden architecture.
- **Next step** If you’d like, I can adapt this to your exact current frontend code (`receiptproject.html` + `receipt-processor-new.js`) and propose specific API call examples.
