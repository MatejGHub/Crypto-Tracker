# CryptoTrack

A full-stack crypto dashboard with market tracking, watchlist persistence, auth, and theme preferences.

## Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend API: Laravel
- Database: PostgreSQL
- Charts: Recharts
- Data source: CoinGecko API

## Features

- Dashboard with market overview + charts
- Markets table with sparkline chart and coin detail navigation
- Watchlist with authenticated persistence (Laravel API + DB)
- Login/register modal flow
- Theme toggle (dark/light) with per-user/guest preference persistence
- Settings page actions (session clear/logout, cache reset, theme reset)

## Known Issue (Production Access)

- Crypto domains are often treated as high-risk by automated provider/browser filters (similar to categories that commonly get strict blocking policies), which can cause false-positive warning pages on some networks.

## Project Structure

- `frontend/` -> React app (Vite)
- `backend/` -> Laravel API

## Local Setup

### 1) Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2) Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```
