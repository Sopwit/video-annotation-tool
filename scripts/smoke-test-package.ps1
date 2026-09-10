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

$executable = Join-Path $installDirectory "Video Annotation Tool.exe"
$uninstaller = Join-Path $installDirectory "Uninstall Video Annotation Tool.exe"
if (-not (Test-Path $executable)) { throw "Installed executable is missing." }
if (-not (Test-Path $desktopShortcut)) { throw "Desktop shortcut is missing." }

$application = Start-Process -FilePath $executable -PassThru
Start-Sleep -Seconds 10
if ($application.HasExited) {
  throw "Application exited during startup with code $($application.ExitCode)."
}
$application.Kill()
$application.WaitForExit()

if (Test-Path $uninstaller) {
  $uninstall = Start-Process -FilePath $uninstaller -ArgumentList "/S" -Wait -PassThru
  if ($uninstall.ExitCode -ne 0) {
    throw "NSIS uninstall failed with exit code $($uninstall.ExitCode)."
  }
}
