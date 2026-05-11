# Backend runner for Windows PowerShell.
# Uses the `py` launcher because `python` on this machine is a Microsoft Store stub.
# Usage: .\run.ps1

$ErrorActionPreference = "Stop"

function Resolve-Python {
    # Prefer `py` launcher (avoids Microsoft Store stub on Windows).
    if (Get-Command py -ErrorAction SilentlyContinue) { return "py" }

    $real = Get-Command python -ErrorAction SilentlyContinue
    if ($real -and ($real.Source -notlike "*WindowsApps*")) {
        return "python"
    }

    Write-Host "ERROR: No real Python found." -ForegroundColor Red
    Write-Host "Install Python 3.11+ from https://www.python.org/downloads/ " -ForegroundColor Yellow
    Write-Host "and ensure 'Add Python to PATH' is checked." -ForegroundColor Yellow
    Write-Host "Tip: Disable Windows App Execution Aliases for python.exe / python3.exe " -ForegroundColor Yellow
    Write-Host "  (Settings -> Apps -> Advanced app settings -> App execution aliases)" -ForegroundColor Yellow
    exit 1
}

$PY = Resolve-Python
Write-Host "Using Python: $PY" -ForegroundColor Cyan
& $PY --version

if (-not (Test-Path .\.venv\Scripts\Activate.ps1)) {
    Write-Host "Creating venv..." -ForegroundColor Cyan
    & $PY -m venv .venv
}

Write-Host "Activating venv..." -ForegroundColor Cyan
. .\.venv\Scripts\Activate.ps1

Write-Host "Upgrading pip + installing dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if (-not (Test-Path .\.env)) {
    Write-Host "ERROR: .env missing. Copy .env.example to .env and add your Cohere key." -ForegroundColor Red
    exit 1
}

Write-Host "Starting FastAPI on http://localhost:8000 ..." -ForegroundColor Green
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000