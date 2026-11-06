@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo    Coco Miracles - Serveur Local
echo ========================================
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Node.js 18 ou plus recent est requis.
    echo Installez Node.js depuis https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Ouvrez http://localhost:8000 dans votre navigateur.
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.
node local-server.js
