param(
    [Parameter(Position = 0)]
    [ValidateSet('preview', 'check', 'status', 'publish')]
    [string]$Action = 'status'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot

function Invoke-RepoCommand {
    param([scriptblock]$Command)
    Push-Location $repoRoot
    try {
        $output = & $Command
        if ($LASTEXITCODE -ne 0) { throw "Command failed with exit code $LASTEXITCODE." }
        return $output
    }
    finally { Pop-Location }
}

function Get-Branch {
    $branch = (Invoke-RepoCommand { git branch --show-current } | Out-String).Trim()
    if (-not $branch) { throw 'Unable to determine the current Git branch.' }
    return $branch
}

function Invoke-SiteCheck {
    Invoke-RepoCommand { bundle exec jekyll build } | Write-Output
    Invoke-RepoCommand { git diff --check } | Write-Output

    $trackedFiles = Invoke-RepoCommand { git ls-files }
    $textFiles = $trackedFiles | Where-Object {
        $_ -match '\.(md|markdown|html|yml|yaml|json|xml|txt|css|js|ps1|rb)$'
    } | ForEach-Object { Join-Path $repoRoot $_ }

    if ($textFiles) {
        $sensitive = Select-String -Path $textFiles -Pattern 'BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY|https?://[^\s)]*(feishu\.cn|larksuite\.com)' -CaseSensitive:$false
        if ($sensitive) {
            $sensitive | ForEach-Object { Write-Error "Sensitive content: $($_.Path):$($_.LineNumber)" }
            throw 'Sensitive content scan failed.'
        }
    }
    Write-Host 'Checks passed.' -ForegroundColor Green
}

switch ($Action) {
    'preview' {
        Write-Host 'Preview: http://127.0.0.1:4000/' -ForegroundColor Cyan
        Invoke-RepoCommand { bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload } | Write-Output
    }
    'check' { Invoke-SiteCheck }
    'status' {
        Write-Host "Repository: $repoRoot"
        Write-Host "Branch: $(Get-Branch)"
        Write-Host 'Working tree:'
        Invoke-RepoCommand { git status --short } | Write-Output
    }
    'publish' {
        $branch = Get-Branch
        if ($branch -ne 'redesign-frame-system') {
            Write-Error "Publish is allowed only from redesign-frame-system; current branch is $branch."
            exit 2
        }
        Invoke-SiteCheck
        Write-Host 'Pushing existing commits. This command does not stage or commit files.' -ForegroundColor Cyan
        Invoke-RepoCommand { git push origin redesign-frame-system } | Write-Output
    }
}

