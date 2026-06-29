@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Page Agent - Quick Start

set "SCRIPT_DIR=%~dp0"
set "START_PS1=%SCRIPT_DIR%scripts\start.ps1"

if not exist "%START_PS1%" (
    echo [ERROR] Missing startup script: %START_PS1%
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%START_PS1%" %*
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
    echo.
    echo [ERROR] Quick start failed. Exit code: %EXIT_CODE%
    pause
    exit /b %EXIT_CODE%
)

exit /b 0
