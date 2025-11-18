# Blueberry Garden - Project Architecture

## Overview
This document outlines the architecture for Colin's Blueberry Garden portfolio and its integrated projects, focusing on a unified system that connects personal finance, fitness tracking, and AI assistance.

## Core Projects

### 1. Personal Finance Suite
**Components:**
- **Receipt Processor** (Current Project)
  - Upload/scan receipts
  - Extract transaction data
  - Categorize expenses

- **Expense Calculator**
  - Budget planning
  - Spending analytics
  - Financial forecasting

### 2. Fitness Tracker
- Workout logging
- Progress tracking
- Weight/rep progression
- Consistency monitoring

### 3. AI Personal Assistant
- Context-aware recommendations
- Preference learning system
- Cross-project integration

## Technical Architecture

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── finance/       # Receipts, expenses, budgets
│   │   │   ├── fitness/       # Workout tracking
│   │   │   ├── ai/            # Assistant features
│   │   │   └── users/         # User management
│   │
│   ├── models/
│   │   ├── finance.py
│   │   ├── fitness.py
│   │   ├── ai.py
│   │   └── user.py
│   │
│   ├── services/
│   │   ├── receipt_processor.py
│   │   ├── expense_analyzer.py
│   │   ├── fitness_tracker.py
│   │   └── ai_assistant.py
│   │
│   └── core/
│       ├── database.py
│       ├── config.py
│       └── security.py
```

### Database Schema (Key Entities)

#### Users
```python
class User(Base):
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    preferences = Column(JSON)  # Stores user preferences across all features
    created_at = Column(DateTime)
```

#### Finance
```python
class Receipt(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    merchant = Column(String)
    total = Column(Float)
    date = Column(DateTime)
    category = Column(String)
    items = relationship("ReceiptItem")

class Budget(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    category = Column(String)
    amount = Column(Float)
    period = Column(String)  # monthly, weekly, etc.
```

#### Fitness
```python
class Workout(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(DateTime)
    workout_type = Column(String)
    exercises = relationship("Exercise")

class Exercise(Base):
    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workouts.id'))
    name = Column(String)
    sets = relationship("ExerciseSet")
```

#### AI Assistant
```python
class UserPreference(Base):
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    preference_type = Column(String)  # e.g., 'dietary', 'workout', 'spending'
    key = Column(String)              # e.g., 'preferred_gym_time'
    value = Column(JSON)              # Flexible value storage
    importance = Column(Float)        # 0.0 to 1.0 scale
```

## Integration Points

### 1. Cross-Project Data Flow
- Receipt data → Expense tracking
- Workout data → Progress analytics
- User preferences → AI recommendations

### 2. AI Assistant Integration
- Context-aware suggestions based on:
  - Spending habits
  - Workout consistency
  - User preferences
  - Calendar events

## Development Phases

### Phase 1: Foundation
- [ ] User authentication
- [ ] Basic receipt processing
- [ ] Simple expense tracking

### Phase 2: Core Features
- [ ] Budget management
- [ ] Workout logging
- [ ] Basic AI recommendations

### Phase 3: Advanced Features
- [ ] AI preference learning
- [ ] Cross-feature insights
- [ ] Mobile app integration

## Technical Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **AI/ML**: Scikit-learn, spaCy

### Frontend
- **Framework**: React (for complex UIs)
- **State Management**: Redux/Context API
- **Visualization**: Chart.js/D3.js

### Deployment
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Frontend) + Railway (Backend)

## Future Considerations
1. Mobile app development
2. Wearable device integration
3. Voice assistant capabilities
4. Advanced ML for personalized insights

---
Last Updated: 2025-07-08
Created by: Colin's Blueberry Garden Team
