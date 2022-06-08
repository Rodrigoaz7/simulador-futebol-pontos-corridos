#!/bin/bash
systemctl start httpd.service
systemctl enable httpd.service
set -e
cd /var/www/html/  
npm start