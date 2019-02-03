
#!/bin/bash

# Catch and log errors
trap uncaughtError ERR
function uncaughtError {
  echo -e "\n\t❌  Error\n"
  echo "$(<${ERROR_LOG})"
  echo -e "\n\t😞  Sorry\n"
  exit $?
}

function initDirectories() {
  TEMP_DIR="$(mktemp -d)"
  ERROR_LOG="${TEMP_DIR}/hopin-pi-sdk-err.log"

  echo -e "📂  Setting up directories..."
  echo -e "\tTemp:\t\t${TEMP_DIR}"
  echo -e "\n\t✔️  Done\n"
}

function installNode() {
  # Install Node and NPM - https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
  echo -e "📦  Installing Node.js..."
  if ! [ -x "$(command -v node)" ]; then
    NODE_VERSION=10
    curl -sL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | sudo bash - &> ${ERROR_LOG}
    sudo apt-get install -y nodejs &> ${ERROR_LOG}
  fi
  echo -e "\n\t✅  Done\n"
}

function installNPMModules() {
  echo -e "📦  Installing NPM Modules..."
  npm install -g @hopin/pi-workflow &> ${ERROR_LOG}
  echo -e "\n\t✅  Done\n"
}

# -e means 'enable interpretation of backslash escapes'
echo -e "\n📓  Installing @hopin/pi-sdk\n"

initDirectories

installNode

installNPMModules