@echo off
cd /d "%~dp0"
echo ========================================================
echo   GLOSARIO TRANSVERSAL // PROTOCOLO THALIOS SOLARIS 4.0
echo ========================================================
echo.
echo Iniciando servidor en puerto 5173...
echo.
npm run dev -- --open --port 5173
