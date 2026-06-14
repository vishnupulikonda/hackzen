# embed-qr.ps1
# Drop your QR image in this folder as qr.png, then run this script.
# It will encode it to Base64 and patch it into index.html automatically.

$imgPath = Join-Path $PSScriptRoot "qr.png"
$htmlPath = Join-Path $PSScriptRoot "index.html"

if (-not (Test-Path $imgPath)) {
    Write-Host "ERROR: qr.png not found in $PSScriptRoot" -ForegroundColor Red
    Write-Host "Save your QR image as qr.png in the same folder, then re-run this script." -ForegroundColor Yellow
    pause
    exit 1
}

$bytes = [System.IO.File]::ReadAllBytes($imgPath)
$b64   = [Convert]::ToBase64String($bytes)
$dataUrl = "data:image/png;base64,$b64"

$html = Get-Content $htmlPath -Raw
$patched = $html -replace 'src="qr\.png"', "src=`"$dataUrl`""

Set-Content $htmlPath $patched -Encoding UTF8
Write-Host "Done! QR code embedded into index.html as Base64." -ForegroundColor Green
pause
