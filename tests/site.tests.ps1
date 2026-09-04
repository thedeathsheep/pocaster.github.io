$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path $repoRoot 'scripts/site.ps1'

if (-not (Test-Path -LiteralPath $scriptPath)) { throw 'Expected scripts/site.ps1 to exist.' }

$statusOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath status 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { throw "status failed:`n$statusOutput" }
if ($statusOutput -notmatch 'Branch:' -or $statusOutput -notmatch 'Working tree:') {
    throw "status output is incomplete:`n$statusOutput"
}

Write-Host 'site.ps1 status test passed.'

