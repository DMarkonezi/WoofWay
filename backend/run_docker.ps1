param (
    [switch]$r
)

if ($r) {
    Write-Host ">>> Rebuilding infrastructure..." -ForegroundColor Red
    docker compose down
    docker compose up --build -d
} else {
    Write-Host ">>> Starting infrastructure..." -ForegroundColor Green
    docker compose up -d
}
docker compose ps