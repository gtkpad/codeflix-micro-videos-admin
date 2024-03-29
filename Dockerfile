FROM node:16.16.0-slim

RUN mkdir -p /usr/share/man/man1 && \
  # echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list && \
  apt-get update && apt-get install -y \
  git \
  procps \
  ca-certificates \
  openjdk-11-jre \
  zsh \
  curl \
  wget \
  fonts-powerline

RUN npm install -g @nestjs/cli@9.0.0 npm@8.5.5

ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

USER node

# Default powerline10k theme, no plugins installed
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" \
  -t https://github.com/romkatv/powerlevel10k \
  -p git \
  -p git-flow \
  -p https://github.com/zdharma-continuum/fast-syntax-highlighting \
  -p https://github.com/zsh-users/zsh-autosuggestions \
  -p https://github.com/zsh-users/zsh-completions \
  -a 'export TERM=xterm-256color' 

RUN echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc && \
    echo 'HISTFILE=~/zsh/.zsh_history' >> ~/.zshrc 

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]