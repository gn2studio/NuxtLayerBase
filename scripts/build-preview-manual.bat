@echo off
setlocal

rem Build helper for preview deployment from cmd.exe.
rem Usage:
rem   scripts\build-preview-manual.bat
rem   scripts\build-preview-manual.bat my-repo
rem   scripts\build-preview-manual.bat /custom-base/

set "BASE_URL=/"

if not "%~1"=="" (
  set "ARG=%~1"

  rem If the argument already starts with '/', treat it as a full base URL.
  if "%ARG:~0,1%"=="/" (
    set "BASE_URL=%ARG%"
  ) else (
    set "BASE_URL=/%ARG%/"
  )
)

set "NUXT_APP_BASE_URL=%BASE_URL%"
echo [preview] NUXT_APP_BASE_URL=%NUXT_APP_BASE_URL%
echo [preview] Running build:preview:manual...

call npm run build:preview:manual
if errorlevel 1 (
  echo [preview] Build failed.
  exit /b 1
)

echo [preview] Done.
echo [preview] Upload folder: preview-dist
endlocal
