@ECHO OFF
@REM uses a short node snippet to generate a base64 secret
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"