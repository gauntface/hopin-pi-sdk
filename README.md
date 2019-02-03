WARNING: This is very rough and likely to break your Pi. Use at your own
risk!

## Installation on Pi

Before you can install anything, you'll need internet access.

### Setup Wifi

You'll need to know your wifi details.

You can use the `sudo raspi-config` command to setup the Wifi name
and passkey OR you can edit the wpa_spplicant.conf file:

```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

Adding details along the lines of:

```
network={
    ssid="testing"
    psk="testingPassword"
}
```

You can use `ping google.com` to check you have a working connection.

### Run Install Script

Then to install `@hopin/pi-workflow`, run this script, which will
install node if needed and then install the pi-workflow NPM package.

> NOTE: Installing node can take some time on the Pi (a few minutes).

```
sudo apt-get install curl && bash <(curl -s "https://raw.githubusercontent.com/gauntface/hopin-pi-sdk/master/scripts/bootstrap.sh?$(date +%s)")
```