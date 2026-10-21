@echo off
cd /d "%~dp0"
echo ========================================================
echo   GLOSARIO TRANSVERSAL // COMPILADOR INSTALADOR WINDOWS
echo ========================================================
echo.
echo Compilando aplicacion y empaquetando ejecutable .EXE...
echo.
npm run electron:build
echo.
echo ========================================================
echo   Proceso finalizado. Revisa la carpeta 'release'
echo ========================================================
pause
