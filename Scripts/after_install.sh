#!/bin/bash
cp -R /home/ec2-user/app/* /var/www/html/   
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
. ~/.nvm/nvm.sh
nvm install node
nvm use 16
