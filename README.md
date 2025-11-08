# Project Overview

## Project Idea Base
- Backtesting and paper trading.
- Log trades (import via broker APIs) with PnL and order details.
- Instant report card for every trade (mistakes, what went right/wrong).
- Calculate win and loss rates by analyzing the user's past trades.
- Based on past trades, suggest improvements.

## Tech Stack
- **Backend**: Node.js, Express, PostgreSQL.
- **Web**: Next.js, Tailwind, ShadCN.
- **App**: React Native.
- **DevOps**: Docker, CI/CD, AWS.

---

## Summary

### Backend
- **Authentication**: Implemented using `jsonwebtoken (JWT)` for token-based authentication and `bcrypt` for password hashing.
- **Framework**: Built with `Express.js` for creating RESTful APIs.
- **Database**: Integrated with `PostgreSQL` for data persistence.
- **Migrations**: Managed using `npm run migrate` for database schema updates.
- **Environment**: Runs on `PORT 8080` with `npm run dev`.

### Web
- **Framework**: Developed using `Next.js` for server-side rendering and React-based frontend.
- **Development Server**: Runs on `PORT 3000` with `npm run dev`.
- **Styling**: Supports modern CSS-in-JS solutions for styling components.
- **State Management**: Utilizes React's built-in state management features.

---

## Commands

### Backend
- **Connect to Database**:  
    ```bash
    psql -U myuser -h localhost -d myappdb
    ```
- **Create New Database**:  
    ```bash
    npm run migrate
    ```
- **Run Server**:  
    ```bash
    npm run dev
    ```
- **Environment**:  
    - `PORT`: 8080

### Web
- **Run Web Server**:  
    ```bash
    npm run dev
    ```
- **Environment**:  
    - `PORT`: 3000

---

## App
- **Run Commands**: