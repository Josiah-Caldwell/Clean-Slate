#!/bin/bash

# File name of lambda code file
LAMBDA_CODE="cleanslate.py"

# Path to CleanSlateLambda project root
PROJECT_ROOT=$(pwd)

# Path to site-packages folder
SITE_PACKAGES=$(pipenv --venv)/lib/python3.9/site-packages
echo "[CLEAN SLATE] Python dependencies are at $SITE_PACKAGES"

# Install all dependencies
echo "[CLEAN SLATE] Installing python dependencies"
pipenv install

# Create lambda deployment package and zip all python dependencies
echo "[CLEAN SLATE] Packaging python dependencies"
cd $SITE_PACKAGES
zip -r9 $PROJECT_ROOT/build/clean-slate-lambda-deployment.zip *

# Include lambda code into lambda deployment package
echo "[CLEAN SLATE] Packaging lambda code"
cd $PROJECT_ROOT
zip -g build/clean-slate-lambda-deployment.zip $LAMBDA_CODE

echo "[CLEAN SLATE] Lambda deployment package creation SUCCESSFUL"