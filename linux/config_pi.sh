## Install Chromium
# https://www.raspberrypi.org/forums/viewtopic.php?t=121195
wget https://dl.dropboxusercontent.com/u/87113035/chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb
wget https://dl.dropboxusercontent.com/u/87113035/chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
wget https://dl.dropboxusercontent.com/u/87113035/chromium-codecs-ffmpeg-extra_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
sudo dpkg -i chromium-codecs-ffmpeg-extra_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
sudo dpkg -i chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb

## Generate SSH Key
# https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-linux
ssh-keygen -q -t rsa -b 4096 -C "chris@gervang.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

## Add SSH key to github
# https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-linux
apt-get install xclip
xclip -sel clip < ~/.ssh/id_rsa.pub

## Install bluetooth GUI
apt-get install blueman
