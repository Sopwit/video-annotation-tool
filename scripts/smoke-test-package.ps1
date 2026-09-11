param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("x64", "arm64")]
  [string]$Architecture
)

$ErrorActionPreference = "Stop"
$installer = Get-ChildItem "release/*.exe" | Select-Object -First 1
if (-not $installer) {
  throw "Windows $Architecture installer was not created."
}

$installDirectory = Join-Path $env:RUNNER_TEMP "VideoAnnotationTool-$Architecture"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "Video Annotation Tool.lnk"

$install = Start-Process -FilePath $installer.FullName -ArgumentList "/S", "/D=$installDirectory" -Wait -PassThru
if ($install.ExitCode -ne 0) {
  throw "NSIS installation failed with exit code $($install.ExitCode)."
}

if (-not (Test-Path $desktopShortcut)) { throw "Desktop shortcut is missing." }

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($desktopShortcut)
$executable = $shortcut.TargetPath
if (-not $executable -or -not (Test-Path $executable)) {
  throw "Desktop shortcut does not target an installed executable."
}
$actualInstallDirectory = Split-Path -Parent $executable
$uninstaller = Join-Path $actualInstallDirectory "Uninstall Video Annotation Tool.exe"

$smokeLog = Join-Path $env:RUNNER_TEMP "video-annotation-tool-ui-smoke-$Architecture.log"
$smokeResult = Join-Path $env:RUNNER_TEMP "video-annotation-tool-ui-smoke-$Architecture.json"
Remove-Item $smokeResult -ErrorAction SilentlyContinue
$previousSmokeValue = $env:ELECTRON_UI_SMOKE_TEST
$previousSmokeResult = $env:ELECTRON_UI_SMOKE_RESULT
$env:ELECTRON_UI_SMOKE_TEST = "true"
$env:ELECTRON_UI_SMOKE_RESULT = $smokeResult
try {
  $application = Start-Process -FilePath $executable -RedirectStandardOutput $smokeLog -RedirectStandardError "$smokeLog.stderr" -PassThru
  if (-not $application.WaitForExit(20000)) {
    $application.Kill()
    throw "Application UI smoke test timed out."
  }
} finally {
  $env:ELECTRON_UI_SMOKE_TEST = $previousSmokeValue
  $env:ELECTRON_UI_SMOKE_RESULT = $previousSmokeResult
}

$smokeOutput = @()
if (Test-Path $smokeLog) { $smokeOutput += Get-Content $smokeLog }
if (Test-Path "$smokeLog.stderr") { $smokeOutput += Get-Content "$smokeLog.stderr" }
$smokeOutput | Write-Host
if ($application.ExitCode -ne 0 -or -not (Test-Path $smokeResult)) {
  throw "Packaged UI did not render successfully (exit code $($application.ExitCode))."
}
Get-Content $smokeResult | Write-Host

if (Test-Path $uninstaller) {
  $uninstall = Start-Process -FilePath $uninstaller -ArgumentList "/S" -Wait -PassThru
  if ($uninstall.ExitCode -ne 0) {
    throw "NSIS uninstall failed with exit code $($uninstall.ExitCode)."
  }
}
