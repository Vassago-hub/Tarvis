param(
    [string]$CaptainName = "队长姓名"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$submissionRoot = Join-Path $root "submissions"
$workDir = Join-Path $submissionRoot "赛道一_TCL官网智能服务助手_$CaptainName"
$zipPath = Join-Path $submissionRoot "赛道一_TCL官网智能服务助手_$CaptainName.zip"

if (Test-Path -LiteralPath $workDir) {
    Remove-Item -LiteralPath $workDir -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $workDir | Out-Null

$items = @(
    "package.json",
    "package-lock.json",
    "tsconfig.base.json",
    "tsconfig.typecheck.json",
    "eslint.config.js",
    ".prettierignore",
    ".node",
    "start.bat",
    "start.sh",
    "scripts",
    "packages\page-controller",
    "packages\ui",
    "packages\llms",
    "packages\core",
    "packages\page-agent",
    "packages\website",
    "examples\tcl-official-site",
    "docs\tcl-service-agent",
    "submissions\track-one-tcl-service-agent"
)

foreach ($item in $items) {
    $source = Join-Path $root $item
    $target = Join-Path $workDir $item
    if (Test-Path -LiteralPath $source -PathType Container) {
        New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
        if ($item -eq ".node") {
            Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
        } else {
            Copy-Item -LiteralPath $source -Destination $target -Recurse -Force -Exclude "node_modules", "dist", ".vite", ".vite-temp"
        }
    } elseif (Test-Path -LiteralPath $source -PathType Leaf) {
        New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
        Copy-Item -LiteralPath $source -Destination $target -Force
    }
}

$cleanupPatterns = @("node_modules", "dist", ".vite", ".vite-temp", ".npm-cache")
foreach ($pattern in $cleanupPatterns) {
    Get-ChildItem -LiteralPath $workDir -Directory -Recurse -Force -Filter $pattern |
        Where-Object { $_.FullName -notlike (Join-Path $workDir ".node*") } |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force }
}

$packageJsonPath = Join-Path $workDir "package.json"
$packageJson = Get-Content -Raw -LiteralPath $packageJsonPath | ConvertFrom-Json
$packageJson.workspaces = @(
    "packages/page-controller",
    "packages/ui",
    "packages/llms",
    "packages/core",
    "packages/page-agent",
    "packages/website"
)
$packageJson.scripts.typecheck = "tsc --noEmit -p tsconfig.typecheck.json"
$packageJson | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $packageJsonPath -Encoding utf8

Compress-Archive -Path (Join-Path $workDir "*") -DestinationPath $zipPath -Force
Write-Host $zipPath



