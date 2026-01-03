# NearBuy Quick Start Script
# This script starts both backend and frontend servers

Write-Host "Starting NearBuy Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js version: $(node --version)" -ForegroundColor Cyan
Write-Host ""

# Backend setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found in backend!" -ForegroundColor Red
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Please update the .env file with your database credentials!" -ForegroundColor Yellow
}

Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Frontend setup
Set-Location ../frontend
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:5000/api" | Out-File -FilePath .env -Encoding utf8
}

Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "NearBuy Application Started Successfully!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Yellow
Write-Host ""
