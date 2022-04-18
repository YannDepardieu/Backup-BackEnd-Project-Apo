# OVH

## Se connecter au serveur OVH depuis le terminal local

```s
ssh starrynight@54.38.188.38
```

## Mettre à jour la listes des packages sur le serveur

```s
sudo apt update
```

## Installation de node avec NVM sur le serveur

https://github.com/creationix/nvm

### Avec BASH

```s
sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# OU
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

```s
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm -v # Voir la version
nvm install --lts
```

Une seule ligne ici :

```s
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Relancer le terminal et  `nvm install node` pour installer la dernière version ???

### Avec ZSH

```s
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | zsh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
source ~/.zshrc
nvm --version
node -v
nvm install 16.13.0
```

## Raccorder le serveur avec un compte github pour mettre un projet sur le serveur

```s
ssh-keygen
ssh-keygen -t rsa -b 4096 -C "yanndepardieu@outlook.fr"
cat ~/.ssh/id_rsa.pub
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

Configurer git sur le serveur :

```s
git config --global user.name "YannDepardieu"
git config --global user.email "yanndepardieu@outlook.fr"
git config --global core.editor nano
git config --global color.ui true
```

Maintenant on peut cloner un repo sur le serveur

## Installer les dépendances

```s
npm i
npm i node-dev -g
```

## Installer postgresql sur le serveur

```s
sudo apt install postgresql
```

Ensuite on crée un user et une DB comme on sait faire :

```s
sudo -i -u postgres psql
...

## Installer Redis sur le serveur

```s
sudo apt install redis-server
sudo systemctl status redis-server
sudo nano /etc/redis/redis.conf
sudo systemctl restart redis-server
ss -an | grep 6379  # Port par défaut de redis
redis-cli # Se connecter au service redis
```

Dans le service redis on peut taper "ping" (sans les guillemets) et ça va renvoyer "pong" pour tester que tout fonctionne.

## Adapter le projet pour le serveur

`nano nomFichier` => Crée et ouvre le fichier
Ici on crée et on ouvre les 2 fichiers ignorés par git pour mettre la configuration adaptée dedans

```s
nano .env
nano sqitch.conf
```

## Installer Sqitch sur le serveur

```s
sudo apt-get install sqitch libdbd-pg-perl postgresql-client libdbd-sqlite3-perl sqlite3
```

On peut déployer et seeder la db

## Installer PM2 et utilisation

```s
npm install pm2 -g
pm2 start npm --no-automation --name "starrynight-back" -- run "dev"
pm2 list  # Permet de voir tous les projet gérés par pm2
pm2 stop starrynight-back
pm2 restart starrynight-back
pm2 logs starrynight-back
pm2 delete starrynight-back
```

## Se mettre en superutilisateur depuis le terminal local pour éviter de retaper le mdp du serveur

```s
ssh-copy-id starrynight@54.38.188.38
```

## URLs de test

```s
http://54.38.188.38:5000/api-docs/
http://54.38.188.38:5000/v1/api/
```