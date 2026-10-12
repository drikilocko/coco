@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🎉 Coco Miracles - Serveur Local
echo ========================================
echo.
echo Démarrage du serveur sur le port 8000...
echo.
echo Ouvrez votre navigateur et allez sur :
echo    👉 http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.
cd /d "%~dp0"

:: Essayer Python d'abord
python --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python detecte - Demarrage du serveur...
    python -m http.server 8000
    goto end
)

:: Essayer Python 3
python3 --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Python3 detecte - Demarrage du serveur...
    python3 -m http.server 8000
    goto end
)

:: Essayer Node.js
node --version >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Node.js detecte - Installation de http-server...
    npm install -g http-server >nul 2>&1
    echo [OK] Demarrage du serveur...
    http-server -p 8000
    goto end
)

echo [ERREUR] Aucun serveur trouve (Python ou Node.js requis)
echo.
echo Installez Python depuis : https://www.python.org/downloads/
echo Ou Node.js depuis : https://nodejs.org/
echo.
pause

:end
