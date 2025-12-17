# Orda Marketplace Simulation

Smart Orda is a simulated marketplace application designed for the SDU (Suleyman Demirel University) ecosystem.

## Project Structure

- `backend/`: FastAPI application (Python)
- `frontend/`: Next.js application (TypeScript)
## Getting Started

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies using `uv`:
   ```bash
   uv sync
   ```
3. Run the development server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

## Design Patterns

This project implements several design patterns for academic review:
- **Factory Method**: For Listing creation.
- **Strategy Pattern**: For sorting algorithms.
- **Observer Pattern**: For real-time alerts.
- **Proxy Pattern**: For access control.

## SOLID Principles

The architecture is designed to strictly adhere to SOLID principles.
