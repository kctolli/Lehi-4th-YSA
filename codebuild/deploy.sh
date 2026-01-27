#!/bin/bash

cd ~/hpysa/web ## Assume your code is in ~/hpysa/web

git status
git pull 
git add . 
git commit -m "Deploy --- `date +%m`/`date +%d`/`date +%Y` `date +%r`"
git push
