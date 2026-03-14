---
description: Build and deploy Tabtop frontend to the Raspberry Pi Nginx server
---

## Prerequisites
- SSH access to the Pi (key-based preferred)  
- Nginx running on the Pi  
- `rsync` available on Windows (via Git Bash, WSL, or MSYS2)

## Variables (edit as needed)
```
PI_USER=pi
PI_HOST=192.168.1.100       # or pi.local, tabtop.local, etc.
PI_PATH=/var/www/tabtop
NGINX_CONF=tabtop.conf
```

## Steps

### 1. Build the production bundle
```powershell
cd "d:\Google Drive\Backup\Code\Tabdash\frontend"
npm run build
```
Output lands in `frontend/dist/`.

### 2. Upload the built files to the Pi
Run from a Git Bash / WSL terminal (rsync over SSH):
```bash
PI_USER=pi
PI_HOST=pi.local
PI_PATH=/var/www/tabtop

rsync -avz --delete \
  "d:/Google Drive/Backup/Code/Tabdash/frontend/dist/" \
  "$PI_USER@$PI_HOST:$PI_PATH/"
```
Or with plain `scp` (slower, no delete):
```bash
scp -r "d:/Google Drive/Backup/Code/Tabdash/frontend/dist/." \
    $PI_USER@$PI_HOST:$PI_PATH/
```

### 3. Install the Nginx config (first time only)
```bash
# Copy the bundled nginx config
scp "d:/Google Drive/Backup/Code/Tabdash/nginx/tabtop.conf" \
    $PI_USER@$PI_HOST:/tmp/tabtop.conf

# On the Pi:
ssh $PI_USER@$PI_HOST "
  sudo cp /tmp/tabtop.conf /etc/nginx/sites-available/tabtop &&
  sudo ln -sf /etc/nginx/sites-available/tabtop /etc/nginx/sites-enabled/tabtop &&
  sudo mkdir -p /var/www/tabtop &&
  sudo chown -R www-data:www-data /var/www/tabtop &&
  sudo nginx -t && sudo systemctl reload nginx
"
```

### 4. On subsequent deploys (only steps 1 + 2 needed)
```powershell
# 1. Build
cd "d:\Google Drive\Backup\Code\Tabdash\frontend"
npm run build

# 2. Sync (from Git Bash / WSL)
rsync -avz --delete \
  "d:/Google Drive/Backup/Code/Tabdash/frontend/dist/" \
  "pi@pi.local:/var/www/tabtop/"
```

## Notes
- Edit `nginx/tabtop.conf` → change `server_name` to match your Pi's hostname or local domain.
- The `VITE_POCKETBASE_URL` in `frontend/.env` must point to your PocketBase API URL before building.
- If Tabtop is served under a subpath (e.g. `/tabtop/`), add `base: '/tabtop/'` to `vite.config.js`.
