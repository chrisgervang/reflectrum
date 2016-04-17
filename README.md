# Reflectrum
A new approach to smart mirror design.

##Installation

###Debugging (OSX)
####Build the front-end
`./linux/config_pi.sh 2#11000000 {installation/directory}`
This command will install javascript packages, and bundle jspm front-end

###Deployment (Tested on Raspian Linux)
####on your computer
insert boot device (SD card) 
copy `config_pi.sh` into the `boot` device
####on raspberry pi
`sudo sh /boot/config_pi.sh`

##Start Reflectrum
###in project directory
`npm start`
