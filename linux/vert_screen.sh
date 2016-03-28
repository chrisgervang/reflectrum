#!/bin/bash

#insert display configuration. You may want different rotation depending on how you built the mirror.
echo "" >> /boot/config.txt
echo "# rotate display 90 degrees" >> /boot/config.txt
echo "display_rotate=1" >> /boot/config.txt

#sed '1i # rotate display 90 degrees\ndisplay_rotate=1' /boot/config.txt > /boot/config.txt
