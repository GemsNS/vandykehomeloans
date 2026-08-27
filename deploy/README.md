# Server deploy templates

Used on the shared GCP Ubuntu 18.04 VM (Apache + Certbot + NVM + PM2).

| Path | Purpose |
| --- | --- |
| `apache/vandykehomeloan.net.conf` | HTTP vhost → copy to `/etc/apache2/sites-available/` |
| `apache/vandykehomeloan.net-le-ssl.conf` | HTTPS vhost template (ProxyPass + cert paths) |
| `public_html/` | Seed files for `/var/www/vandykehomeloan.net/public_html/` |

Full CLI steps: see [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

**Port:** `3010` · **Layout:** `public_html` + sibling `backend` · **Do not edit other sites.**
