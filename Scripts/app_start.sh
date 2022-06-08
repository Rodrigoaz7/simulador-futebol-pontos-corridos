#!/bin/bash
systemctl start httpd.service
systemctl enable httpd.service
set -e
nvm use 16
cd /var/www/html/  
npm start