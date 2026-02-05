@echo off
cd /d "%~dp0"
echo ========================================
echo   WinProvit Support AI - Starting...
echo ========================================
echo.

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo [INFO] A instalar dependencias...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] A iniciar o servidor de desenvolvimento...
echo.
npm run dev

if errorlevel 1 (
    echo.
    echo [ERRO] O servidor falhou ao iniciar!
)
pause
