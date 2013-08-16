sudo apt-get install -y python-software-properties

sudo add-apt-repository -y ppa:saltstack/salt
sudo apt-get update
sudo apt-get install -y salt-minion git

sudo mkdir -d /srv/salt/
sudo git clone https://github.com/vladimir-vovk/dev-env-up.git /srv/salt

sudo salt-call state.highstate --local
