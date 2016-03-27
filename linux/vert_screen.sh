#!/bin/bash

#insert display configuration. You may want display_rotate=1 depending on how you built the mirror.
echo "\n# rotate display 270 degrees\ndisplay_rotate=3" >> /boot/config.txt

#sed '1i # rotate display 90 degrees\ndisplay_rotate=1' /boot/config.txt > /boot/config.txt
