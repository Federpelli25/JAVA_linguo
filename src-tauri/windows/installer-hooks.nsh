!macro StopJavaLinguoBackend
  DetailPrint "Arresto del laboratorio JAVA_linguo in corso..."
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /F /T /IM "java-linguo-backend.exe"'
  Sleep 1000
!macroend

!macro NSIS_HOOK_PREINSTALL
  !insertmacro StopJavaLinguoBackend
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  !insertmacro StopJavaLinguoBackend
!macroend
