@echo off
setlocal

rem Wrapper for cmd.exe users.
rem Usage:
rem   build-preview-manual.cmd
rem   build-preview-manual.cmd my-repo
rem   build-preview-manual.cmd /custom-base/

call scripts\build-preview-manual.bat %*
exit /b %errorlevel%
