$ErrorActionPreference = 'SilentlyContinue'

$nextNodeProcesses = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq 'node.exe' -and (
      $_.CommandLine -match 'next\\dist\\bin\\next' -or
      $_.CommandLine -match 'start-server\.js' -or
      $_.CommandLine -match 'next dev'
    )
  }

foreach ($proc in $nextNodeProcesses) {
  Stop-Process -Id $proc.ProcessId -Force
}

if (Test-Path .next) {
  Remove-Item -Recurse -Force .next
}

Write-Output 'DEV_RESET_DONE'
exit 0
