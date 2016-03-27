# https://www.raspberrypi.org/documentation/installation/installing-images/mac.md
diskutil unmount /dev/disk2s1
dd bs=1m if=/Users/chrisgervang/Downloads/2016-02-26-raspbian-jessie.img  of=/dev/rdisk2
