# Orda Frontend

This is the Next.js frontend for the Orda Marketplace Simulation.

## Features

- **Marketplace Discovery**: Browse, search, and sort listings.
- **Listing Creation**: Dynamic forms for different categories (Books, Dorm Items, Rides).
- **Alert Management**: Subscribe to keywords for automated notifications.
- **User Profiles**: Manage contact information and view personal listings.
- **Authentication**: Secure JWT-based login and registration.

## Design Patterns

The frontend implements several patterns to coordinate with the backend:

- **Mediator**: The `AuthContext` centralizes authentication state.
- **Facade**: `apiFetch` simplifies complex network requests.
- **Strategy**: The home page triggers different sorting algorithms.
- **Observer**: The Alert Manager allows users to subscribe to events.
- **Proxy**: Listing cards handle the display of protected contact info.
- **Factory**: The creation form dynamically renders fields based on category.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run the development server:
   ```bash
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
