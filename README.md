# Orda Marketplace Simulation

Smart Orda is a simulated marketplace application designed for the SDU (Suleyman Demirel University) ecosystem.

## Project Structure

- `backend/`: FastAPI application (Python)
- `frontend/`: Next.js application (TypeScript)

## Getting Started

### Using Docker (Recommended)

1. Start the entire stack:
   ```bash
   docker-compose up --build
   ```
2. The API will be available at `http://localhost:8000` and the frontend at `http://localhost:3000`.

### Manual Setup

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

This project implements several design patterns to ensure high maintainability and clarity. Each pattern is marked in the code with a comment like `#FACTORY`.

### Creational Patterns

- **Factory Method (#FACTORY)**: Used in `ListingFactory` to create different listing types (Textbooks, Dorm Items, Ride-Sharing).
  - _Analogy_: Like a **Pizza Shop**. You order a "Pepperoni" (category), and the kitchen (Factory) makes it for you. You don't need to know how to toss the dough yourself.
- **Singleton (#SINGLETON)**: Used for the Database connection and Auth state.
  - _Analogy_: Like a **Single Office Printer**. Everyone in the office sends documents to the same machine to avoid having 50 different printers taking up space and causing chaos.

### Structural Patterns

- **Proxy Pattern (#PROXY)**: Acts as a gatekeeper for sensitive user contact information.
  - _Analogy_: Like a **Security Guard** at a VIP club. He checks your ID (Login) before letting you see the celebrities (Sensitive Data).
- **Facade Pattern (#FACADE)**: Used in the frontend `apiFetch` to simplify complex network requests.
  - _Analogy_: Like a **TV Remote**. You just press "Power", and it handles all the complex electronics inside. You don't need to be an engineer to watch a show.
- **Decorator Pattern (#DECORATOR)**: Used in FastAPI routes to add web logic to plain functions.
  - _Analogy_: Like **Adding Toppings to a Burger**. The burger is the same, but you "decorate" it with cheese or bacon to add extra features.

### Behavioral Patterns

- **Strategy Pattern (#STRATEGY)**: Allows switching between sorting algorithms (Price, Date, Location) at runtime.
  - _Analogy_: Like a **GPS App**. You can choose "Fastest Route" or "No Tolls". The app stays the same, but the math (Strategy) changes based on your choice.
- **Observer Pattern (#OBSERVER)**: Manages keyword alerts for students.
  - _Analogy_: Like **YouTube Notifications**. You "Subscribe" to a channel. When a new video is posted, the system sends an alert to all fans automatically.
- **Mediator Pattern (#MEDIATOR)**: Used in `AuthContext` to coordinate state between many UI components.
  - _Analogy_: Like an **Air Traffic Controller**. Pilots (Components) don't talk to each other directly; they talk to the tower (Mediator) to avoid crashing.
- **Template Method (#TEMPLATE_METHOD)**: Used in the base `Listing` model.
  - _Analogy_: Like a **Cake Recipe**. The recipe says "Mix, Bake, Decorate". You follow the steps but choose the specific flavor (Chocolate vs. Vanilla).
- **Iterator Pattern (#ITERATOR)**: Used in database session management (`yield db`).
  - _Analogy_: Like a **Deck of Cards**. You deal them one by one. You don't need to hold all 52 cards at once to see the next one.

## Architectural things

We also use high-level architectural patterns to keep the code clean:

- **Dependency Injection (DI)**:
  - _Why_: It stops components from being "stuck" together.
  - _Analogy_: Like a **Car Mechanic**. Instead of the car "owning" its own tools, the mechanic brings the tools (Database/Auth) to the car only when they are needed.
- **Data Transfer Object (DTO)**:
  - _Why_: It ensures we only send the data we want to show, keeping secrets safe.
  - _Analogy_: Like a **Takeout Container**. It only holds the food you ordered, not the chef's secret recipe or the restaurant's electricity bills.
- **Repository / Data Mapper**:
  - _Why_: It separates the "how" of saving data from the "what" of the data itself.
  - _Analogy_: Like a **Librarian**. You ask for a book, and the librarian knows exactly which shelf to find it on. You don't need to know the library's complex filing system.

## SOLID Principles

The architecture strictly adheres to SOLID principles:

- **Single Responsibility Principle (SRP)**: Each feature (listings, users, notifications) is isolated in its own module with dedicated models, routes, and logic.
- **Open/Closed Principle (OCP)**: New listing types or sorting strategies can be added by extending base classes/interfaces without modifying the core factory or context logic.
- **Liskov Substitution Principle (LSP)**: All concrete listing types (e.g., `BookListing`) can be used interchangeably where the base `Listing` class is expected.
- **Interface Segregation Principle (ISP)**: Interfaces like `Observer` and `SortStrategy` are focused and minimal, ensuring that implementing classes only need to provide relevant logic.
- **Dependency Inversion Principle (DIP)**: High-level modules (like routes) depend on abstractions (interfaces/abstract classes) rather than concrete implementations.
