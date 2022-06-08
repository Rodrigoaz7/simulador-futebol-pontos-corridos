#!/bin/bash
set -e
cp -R /home/ec2-user/app/* /var/www/html/   
cd /var/www/html/  
npm start