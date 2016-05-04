[![Stories in Ready](https://badge.waffle.io/chrisgervang/reflectrum.png?label=ready&title=Ready)](https://waffle.io/chrisgervang/reflectrum)
# Reflectrum
A new approach to smart mirror design.

##Installation

###Debugging (OSX)
`./linux/config_pi.sh 2#11000000 {installation/directory}`
This command will install javascript packages, and bundle jspm front-end

###Deployment (Tested on Raspian Linux)
####on your computer
insert boot device (SD card) 
copy `config_pi.sh` into the `boot` device
####on raspberry pi
`sudo sh /boot/config_pi.sh`

##Start Reflectrum
In project root:
`npm start`
By default this will attempt to load Reflectrum into your secondary monitor fullscreen. Modify main.js in the root to change how Reflectrum loads.
