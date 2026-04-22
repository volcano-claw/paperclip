#!/bin/sh
set -e

# Capture runtime UID/GID from environment variables, defaulting to 1000
PUID=${USER_UID:-1000}
PGID=${USER_GID:-1000}

# Adjust the node user's UID/GID if they differ from the runtime request
# and fix volume ownership only when a remap is needed
changed=0

if [ "$(id -u node)" -ne "$PUID" ]; then
    echo "Updating node UID to $PUID"
    usermod -o -u "$PUID" node
    changed=1
fi

if [ "$(id -g node)" -ne "$PGID" ]; then
    echo "Updating node GID to $PGID"
    groupmod -o -g "$PGID" node
    usermod -g "$PGID" node
    changed=1
fi

if [ "$changed" = "1" ]; then
    chown -R node:node /paperclip
fi

mkdir -p /paperclip/hermes-home

copy_if_missing() {
    src="$1"
    dst="$2"
    if [ -e "$src" ] && [ ! -e "$dst" ]; then
        mkdir -p "$(dirname "$dst")"
        cp -R "$src" "$dst"
    fi
}

if [ -d /opt/hermes-seed ]; then
    copy_if_missing /opt/hermes-seed/.env /paperclip/hermes-home/.env
    copy_if_missing /opt/hermes-seed/config.yaml /paperclip/hermes-home/config.yaml
    copy_if_missing /opt/hermes-seed/SOUL.md /paperclip/hermes-home/SOUL.md
    copy_if_missing /opt/hermes-seed/memories /paperclip/hermes-home/memories
    copy_if_missing /opt/hermes-seed/skills /paperclip/hermes-home/skills
    copy_if_missing /opt/hermes-seed/auth.json /paperclip/hermes-home/auth.json
    copy_if_missing /opt/hermes-seed/home/.gitconfig /paperclip/.gitconfig
    copy_if_missing /opt/hermes-seed/home/.git-credentials /paperclip/.git-credentials
fi

chown -R node:node /paperclip/hermes-home || true
[ -f /paperclip/.gitconfig ] && chown node:node /paperclip/.gitconfig || true
[ -f /paperclip/.git-credentials ] && chown node:node /paperclip/.git-credentials || true

exec gosu node "$@"
