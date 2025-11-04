@echo off
chcp 65001 > nul
echo GitHub에 프로젝트를 업로드합니다...
echo.

git init
git add .
git commit -m "Initial commit: 메모앱 프로젝트"
git branch -M main
git remote add origin https://github.com/9562181-jpg/-.git
git push -u origin main

echo.
echo 업로드가 완료되었습니다!
pause

