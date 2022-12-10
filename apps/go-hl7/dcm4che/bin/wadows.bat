@echo off
rem -------------------------------------------------------------------------
rem wadows  Launcher
rem -------------------------------------------------------------------------

if not "%ECHO%" == ""  echo %ECHO%
if "%OS%" == "Windows_NT"  setlocal

set MAIN_CLASS=org.dcm4che3.tool.wadows.WadoWS
set MAIN_JAR=dcm4che-tool-wadows-5.27.0.jar

set DIRNAME=.\
if "%OS%" == "Windows_NT" set DIRNAME=%~dp0%

rem Read all command line arguments

set ARGS=
:loop
if [%1] == [] goto end
        set ARGS=%ARGS% %1
        shift
        goto loop
:end

if not "%DCM4CHE_HOME%" == "" goto HAVE_DCM4CHE_HOME

set DCM4CHE_HOME=%DIRNAME%..

:HAVE_DCM4CHE_HOME

if not "%JAVA_HOME%" == "" goto HAVE_JAVA_HOME

set JAVA=java

goto SKIP_SET_JAVA_HOME

:HAVE_JAVA_HOME

set JAVA=%JAVA_HOME%\bin\java

:SKIP_SET_JAVA_HOME

set CP=%DCM4CHE_HOME%\etc\wadows\
set CP=%CP%;%DCM4CHE_HOME%\lib\%MAIN_JAR%
set CP=%CP%;%DCM4CHE_HOME%\lib\dcm4che-core-5.27.0.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\dcm4che-mime-5.27.0.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\dcm4che-tool-common-5.27.0.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\dcm4che-xdsi-5.27.0.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\slf4j-api-1.7.32.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\logback-core-1.2.9.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\logback-classic-1.2.9.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\commons-cli-1.4.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jakarta.activation-1.2.2.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jakarta.xml.bind-api-2.3.2.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jaxb-runtime-2.3.3-b02.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jakarta.xml.ws-api-2.3.2.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\rt-2.3.2.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jakarta.xml.soap-api-1.4.1.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\jakarta.jws-api-1.1.1.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\istack-commons-runtime-3.0.10.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\saaj-impl-1.5.1.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\streambuffer-1.5.7.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\policy-2.7.6.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\gmbal-4.0.0.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\mimepull-1.9.11.jar
set CP=%CP%;%DCM4CHE_HOME%\lib\stax-ex-1.8.3.jar

"%JAVA%" %JAVA_OPTS% -cp "%CP%" %MAIN_CLASS% %ARGS%
