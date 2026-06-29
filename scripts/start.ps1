param(
    [switch]$CheckOnly,
    [switch]$NoOpen,
    [switch]$SmokeTest,
    [switch]$BuildLibs
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Port = 5173
$HomeUrl = "http://localhost:$Port/page-agent/"
$NodeVersion = "22.22.1"
$PortableNodeDir = Join-Path $Root ".node"
$ServerWindowTitle = "Page Agent Dev Server"
$NpmCacheDir = Join-Path $Root ".npm-cache"

function Write-Header {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  Page Agent Quick Start"
    Write-Host "========================================"
    Write-Host ""
}

function Find-CommandPath {
    param([Parameter(Mandatory = $true)][string]$Name)

    $candidateNames = @($Name)
    if ($IsWindows -or $env:OS -eq "Windows_NT") {
        if ($Name -eq "npm") {
            $candidateNames = @("npm.cmd", "npm.exe", "npm")
        } elseif ($Name -eq "npx") {
            $candidateNames = @("npx.cmd", "npx.exe", "npx")
        }
    }

    foreach ($candidateName in $candidateNames) {
        $command = Get-Command $candidateName -ErrorAction SilentlyContinue
        if ($command) {
            return $command.Source
        }
    }

    return $null
}

function Install-PortableNode {
    $arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
    $url = "https://nodejs.org/dist/v$NodeVersion/node-v$NodeVersion-win-$arch.zip"
    $downloadPath = Join-Path $Root "node-temp.zip"
    $extractPath = Join-Path $Root "node-temp"

    Write-Host "[INFO] Node.js/npm not found. Downloading portable Node.js v$NodeVersion..."
    Write-Host "[INFO] Download URL: $url"
    Write-Host ""

    try {
        if (Test-Path -LiteralPath $downloadPath) {
            Remove-Item -LiteralPath $downloadPath -Force
        }
        if (Test-Path -LiteralPath $extractPath) {
            Remove-Item -LiteralPath $extractPath -Recurse -Force
        }

        $ProgressPreference = "SilentlyContinue"
        Invoke-WebRequest -Uri $url -OutFile $downloadPath -UseBasicParsing

        Write-Host "[INFO] Extracting Node.js..."
        Expand-Archive -LiteralPath $downloadPath -DestinationPath $extractPath -Force

        $extractedFolder = Get-ChildItem -LiteralPath $extractPath -Directory | Select-Object -First 1
        if (-not $extractedFolder) {
            throw "Node.js archive did not contain an extracted directory."
        }

        if (Test-Path -LiteralPath $PortableNodeDir) {
            Remove-Item -LiteralPath $PortableNodeDir -Recurse -Force
        }

        Move-Item -LiteralPath $extractedFolder.FullName -Destination $PortableNodeDir -Force
        Write-Host "[OK] Portable Node.js downloaded to .node\"
    } catch {
        Write-Host ""
        Write-Host "[ERROR] Failed to download portable Node.js."
        Write-Host "[DETAIL] $($_.Exception.Message)"
        Write-Host "[SOLUTION] Install Node.js $NodeVersion or newer manually, then run start.bat again."
        Write-Host "[SOLUTION] Or copy a Windows Node.js portable folder into this project as .node\."
        Write-Host "[SOLUTION] .node\ must contain node.exe and npm.cmd."
        exit 1
    } finally {
        Remove-Item -LiteralPath $downloadPath -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

function Get-NodeTools {
    $portableNode = Join-Path $PortableNodeDir "node.exe"
    $portableNpm = Join-Path $PortableNodeDir "npm.cmd"

    if ((Test-Path -LiteralPath $portableNode) -and (Test-Path -LiteralPath $portableNpm)) {
        Write-Host "[INFO] Using bundled Node.js from .node\"
        return @{
            Node = $portableNode
            Npm = $portableNpm
            Source = "portable"
        }
    }

    $systemNode = Find-CommandPath "node"
    $systemNpm = Find-CommandPath "npm"

    if ($systemNode -and $systemNpm) {
        Write-Host "[INFO] Using system Node.js and npm"
        return @{
            Node = $systemNode
            Npm = $systemNpm
            Source = "system"
        }
    }

    if ($systemNode -and -not $systemNpm) {
        Write-Host "[WARN] System Node.js was found, but npm was not found."
        Write-Host "[INFO] Falling back to portable Node.js download."
    }

    Install-PortableNode

    if (-not (Test-Path -LiteralPath $portableNode)) {
        throw "Portable Node.js download failed: .node\node.exe was not found."
    }
    if (-not (Test-Path -LiteralPath $portableNpm)) {
        throw "Portable Node.js download failed: .node\npm.cmd was not found."
    }

    Write-Host "[INFO] Using bundled Node.js from .node\"
    return @{
        Node = $portableNode
        Npm = $portableNpm
        Source = "portable"
    }
}

function Join-CmdArguments {
    param([string[]]$Arguments)

    return (($Arguments | ForEach-Object { '"' + ($_ -replace '"', '\"') + '"' }) -join " ")
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [switch]$AllowFailure
    )

    Write-Host ""
    Write-Host $Label
    Write-Host ""

    $argumentLine = Join-CmdArguments -Arguments $Arguments
    $commandLine = "cd /d `"$Root`" && "
    if (-not [string]::IsNullOrWhiteSpace($script:PathPrefixDir)) {
        $commandLine += "set `"PATH=$script:PathPrefixDir;%PATH%`" && "
    }
    $commandLine += "call `"$FilePath`" $argumentLine"

    & cmd.exe /d /c $commandLine
    $exitCode = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }

    if ($exitCode -ne 0 -and -not $AllowFailure) {
        throw "$Label failed with exit code $exitCode."
    }
    if ($exitCode -ne 0 -and $AllowFailure) {
        Write-Host "[WARN] $Label failed, but continuing to start the website."
    }
}

function Wait-ForServer {
    $maxWaitSeconds = 90
    Write-Host "[INFO] Waiting for home page to become available..."

    for ($i = 0; $i -lt $maxWaitSeconds; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $HomeUrl -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                Write-Host ""
                Write-Host "[OK] Home page is ready."
                return $true
            }
        } catch {
            # Vite can open the TCP port before the route is ready. Keep waiting.
        }

        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
    }

    Write-Host ""
    Write-Host "[WARN] Home page did not return HTTP success within $maxWaitSeconds seconds."
    Write-Host "[WARN] The server may still be starting. Try opening this URL manually: $HomeUrl"
    return $false
}

function Stop-ProcessTree {
    param([Parameter(Mandatory = $true)][int]$ProcessId)

    $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$ProcessId" -ErrorAction SilentlyContinue
    foreach ($child in $children) {
        Stop-ProcessTree -ProcessId $child.ProcessId
    }

    Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
}

try {
    Write-Header
    $tools = Get-NodeTools

    $PathPrefixDir = if ($tools.Source -eq "portable") { $PortableNodeDir } else { "" }

    $nodeVersionActual = & $tools.Node -v
    $npmVersionActual = & $tools.Npm -v
    Write-Host "[INFO] Node.js version: $nodeVersionActual"
    Write-Host "[INFO] npm version: $npmVersionActual"
    Write-Host ""

    if ($CheckOnly) {
        Write-Host "[OK] Node.js and npm are ready."
        exit 0
    }

    New-Item -ItemType Directory -Path $NpmCacheDir -Force | Out-Null
    $env:npm_config_cache = $NpmCacheDir
    $env:npm_config_update_notifier = "false"

    Invoke-Checked -Label "[STEP 1] Installing dependencies..." -FilePath $tools.Npm -Arguments @("install", "--cache", $NpmCacheDir, "--no-audit")
    Write-Host "[OK] Dependencies installed successfully."

    if ($BuildLibs) {
        Invoke-Checked -Label "[STEP 2] Building library packages..." -FilePath $tools.Npm -Arguments @("run", "build:libs") -AllowFailure
    } else {
        Write-Host ""
        Write-Host "[STEP 2] Skipping library build for quick start."
    }

    Write-Host ""
    Write-Host "[STEP 3] Starting website development server..."
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  Server will start at:"
    Write-Host "  http://localhost:$Port"
    Write-Host "  Home page:"
    Write-Host "  $HomeUrl"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Press Ctrl+C in the server window to stop the server."
    Write-Host ""

    $serverCommand = "title $ServerWindowTitle && cd /d `"$Root`" && "
    if (-not [string]::IsNullOrWhiteSpace($script:PathPrefixDir)) {
        $serverCommand += "set `"PATH=$script:PathPrefixDir;%PATH%`" && "
    }
    $serverCommand += "call `"$($tools.Npm)`" start"
    $startOptions = @{
        FilePath = "cmd.exe"
        ArgumentList = @("/c", $serverCommand)
        WorkingDirectory = $Root
        PassThru = $true
    }
    if ($SmokeTest) {
        $startOptions.WindowStyle = "Hidden"
    }

    $serverProcess = Start-Process @startOptions
    $ready = Wait-ForServer

    if ($SmokeTest) {
        if ($serverProcess -and -not $serverProcess.HasExited) {
            Stop-ProcessTree -ProcessId $serverProcess.Id
        }
        if (-not $ready) {
            throw "Smoke test failed: home page was not reachable."
        }
        Write-Host "[OK] Smoke test passed."
        exit 0
    }

    if (-not $NoOpen) {
        Write-Host ""
        Write-Host "[INFO] Opening home page..."
        Start-Process $HomeUrl
    }

    Write-Host ""
    Write-Host "[OK] Done. Server is running at http://localhost:$Port"
    Write-Host "[OK] Home page: $HomeUrl"
    Write-Host "[INFO] Close the server window or press Ctrl+C there to stop the server."

    if ($serverProcess) {
        Wait-Process -Id $serverProcess.Id
    }
    exit 0
} catch {
    Write-Host ""
    Write-Host "[ERROR] $($_.Exception.Message)"
    Write-Host "[SOLUTION] Fix the error above, then run start.bat again."
    exit 1
}
