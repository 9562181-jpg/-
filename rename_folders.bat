@echo off
chcp 65001 > nul
echo 폴더 이름을 영어로 변경합니다...
echo.

cd "C:\Users\user\Desktop\커서연습"
ren "메모앱" "memo-app"
echo ✓ 메모앱 → memo-app

cd "C:\Users\user\Desktop"
ren "커서연습" "cursor-practice"
echo ✓ 커서연습 → cursor-practice

echo.
echo 폴더 이름 변경이 완료되었습니다!
echo 새 경로: C:\Users\user\Desktop\cursor-practice\memo-app
echo.
pause

