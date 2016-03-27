#!/bin/bash
PROJECT_PATH=/home/pi/code/Reflectrum
jspm bundle ${PROJECT_PATH}/src/main --inject

#npm release /home/pi/code/Reflectrum
#jspm install npm:clean-css --dev
#jspm bundle-sfx src/main.js dist/app.js
