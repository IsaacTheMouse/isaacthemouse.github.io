@echo off
setlocal
cd /d "%~dp0"
title Blog Tool

:menu
echo.
echo ==============================
echo   Blog Tool - myblog
echo ==============================
echo   [1] 启动本地服务器（增量）
echo   [2] 本地构建并预览（清理缓存）
echo   [3] Elog 拉取（语雀同步）
echo   [4] 远程部署
echo   [0] 退出
echo ==============================
set "choice=1"
set /p choice=请选择:  [%choice%]

if "%choice%"=="1" goto server
if "%choice%"=="2" goto build_preview
if "%choice%"=="3" goto sync
if "%choice%"=="4" goto deploy
if "%choice%"=="0" exit /b 0
echo 无效选项，请重新输入。
goto menu

:sync
where elog >nul 2>nul
if errorlevel 1 (
    echo 未检测到 elog，请先执行: npm install -g @elog/cli
    goto menu
)
if not exist ".elog.env" (
    echo 未找到 .elog.env，请先配置凭据文件。
    goto menu
)
call elog sync -e .elog.env
goto menu

:server
start "Hexo Server" /wait cmd /c "npx hexo server -o"
goto menu

:build_preview
call npx hexo clean
if errorlevel 1 goto build_preview_fail
call npx hexo generate
if errorlevel 1 goto build_preview_fail
start "Hexo Server" /wait cmd /c "npx hexo server -o"
goto menu

:build_preview_fail
echo 构建失败，请检查上方输出。
goto menu

:deploy
call npx hexo clean
if errorlevel 1 goto deploy_fail
call npx hexo deploy
if errorlevel 1 goto deploy_fail
echo 部署完成。
goto menu

:deploy_fail
echo 部署失败，请检查上方输出。
goto menu
