# Despliegue

## Requisitos
- Node.js y npm
- [PM2](https://pm2.keymetrics.io/) instalado globalmente (`npm install -g pm2`)
- Nginx y Certbot

## Pasos de despliegue
1. **Acceso por SSH:** conectarse al VPS usando claves públicas.
   ```bash
   ssh usuario@e.logiszar.com
   ```
2. **Obtener código y dependencias:**
   ```bash
   git clone https://github.com/usuario/logiszar-erp.git /var/www/logiszar-erp
   cd /var/www/logiszar-erp
   npm ci
   npm run build
   ```
3. **Iniciar con PM2:**
   ```bash
   npm run pm2
   ```
   El archivo [`ecosystem.config.js`](../ecosystem.config.js) define la aplicación.
4. **Configurar Nginx con TLS:**
   Copiar [`deploy/nginx/e.logiszar.com.conf`](../deploy/nginx/e.logiszar.com.conf) a `/etc/nginx/sites-available/` y habilitarlo.
   Obtener certificados con Certbot:
   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot -d e.logiszar.com
   sudo systemctl reload nginx
   ```

## Rotación de credenciales
1. Generar una nueva clave desde el cliente:
   ```bash
   ssh-keygen -t ed25519 -C "deploy@e.logiszar.com"
   ```
2. Copiar la clave pública al servidor y añadirla a `~/.ssh/authorized_keys` del usuario correspondiente.
3. Eliminar claves antiguas del archivo `authorized_keys`.
4. Reiniciar el servicio SSH si se modificó la configuración (`sudo systemctl restart ssh`).

Mantener deshabilitado el acceso por contraseña (`PasswordAuthentication no`) en `/etc/ssh/sshd_config` para forzar el uso de claves.
