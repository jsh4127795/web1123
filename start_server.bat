@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ========================================================
echo  [STEAM Math 3D Lab] 당기는 입체도형 웹페이지 실행기
echo ========================================================
echo  브라우저를 열고 로컬 서버(http://localhost:8080)를 시작합니다...
echo  종료하시려면 이 창을 닫으시거나 Ctrl+C를 누르세요.
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command "$port = 8080; Start-Process ('http://localhost:' + $port); $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add(('http://localhost:' + $port + '/')); $listener.Start(); Write-Host ('[성공] 웹 서버 실행 중: http://localhost:' + $port); while($listener.IsListening){ try { $ctx = $listener.GetContext(); $reqPath = $ctx.Request.Url.LocalPath.TrimStart('/'); if([string]::IsNullOrEmpty($reqPath)){ $reqPath = 'index.html' }; $filePath = Join-Path (Get-Location) $reqPath; if(Test-Path $filePath -PathType Leaf){ $bytes = [System.IO.File]::ReadAllBytes($filePath); $ext = [System.IO.Path]::GetExtension($filePath).ToLower(); $mime = switch($ext){ '.html'{'text/html; charset=utf-8'} '.js'{'application/javascript; charset=utf-8'} '.css'{'text/css; charset=utf-8'} '.png'{'image/png'} '.jpg'{'image/jpeg'} '.svg'{'image/svg+xml'} default{'application/octet-stream'} }; $ctx.Response.ContentType = $mime; $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length) } else { $ctx.Response.StatusCode = 404 }; $ctx.Response.Close() } catch {} }"
