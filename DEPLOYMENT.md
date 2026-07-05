# Deployment Guide

Complete guide for deploying InvoiceHound to production environments.

## Overview

InvoiceHound can be deployed to:
- **Netlify** (Recommended for quick setup)
- **Vercel** (Recommended for Next.js/Edge functions)
- **Self-hosted** (VPS, Docker, Kubernetes)
- **Cloud Providers** (AWS, Google Cloud, Azure)

## Deploying to Netlify

### Step 1: Prepare Your Project

1. Ensure all changes are committed and pushed:
```bash
git status
git add .
git commit -m "Prepare for production"
git push origin main
```

2. Create a `netlify.toml` file in your project root:
```toml
[build]
  command = "pnpm build"
  publish = "dist"
  functions = "dist/server"

[dev]
  command = "pnpm dev"
  port = 5173

[context.production]
  environment = { NODE_ENV = "production" }

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. Click "Add new site" → "Import an existing project"
3. Select your Git provider (GitHub, GitLab, Bitbucket)
4. Choose the `Invoice` repository
5. Set build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`

### Step 3: Configure Environment Variables

1. In Netlify dashboard, go to Site settings → Environment
2. Add environment variables:

```
VITE_API_URL=https://your-domain.com/api
VITE_RESEND_API_KEY=your_resend_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NODE_ENV=production
```

3. Click "Deploy site"

### Step 4: Set Up Custom Domain

1. Go to Domain settings
2. Click "Add custom domain"
3. Enter your domain (e.g., invoicehound.com)
4. Follow DNS setup instructions from your registrar
5. Wait for DNS propagation (typically 24-48 hours)

### Step 5: Enable HTTPS

Netlify automatically provisions SSL certificates. Verify in Domain settings.

### Step 6: Set Up Automatic Deployments

- Builds automatically trigger on push to main branch
- View deployment logs in the "Deploys" tab
- Rollback to previous versions if needed

## Deploying to Vercel

### Step 1: Prepare Your Project

1. Ensure project is pushed to GitHub
2. Create a `vercel.json` file:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": [
    "VITE_API_URL",
    "VITE_RESEND_API_KEY",
    "VITE_TWILIO_ACCOUNT_SID",
    "VITE_TWILIO_AUTH_TOKEN",
    "VITE_STRIPE_PUBLISHABLE_KEY"
  ]
}
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select GitHub repository
4. Configure project:
   - Framework: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
5. Add environment variables
6. Click "Deploy"

### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to Settings → Environment Variables
2. Add the same variables as Netlify
3. Select which environments they apply to (Production, Preview, Development)

### Step 4: Set Up Custom Domain

1. Go to Settings → Domains
2. Add custom domain
3. Follow DNS instructions
4. Verify ownership if required

### Step 5: Configure Automatic Deployments

- Production deployments trigger on pushes to main
- Preview deployments on pull requests
- Automatic rollbacks available

## Self-Hosted Deployment

### Using Docker

#### 1. Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      VITE_API_URL: https://your-domain.com/api
      VITE_RESEND_API_KEY: ${RESEND_API_KEY}
      VITE_TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      VITE_TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      VITE_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
```

#### 3. Deploy with Docker

```bash
# Build image
docker build -t invoicehound .

# Run container
docker run -d \
  -p 3000:3000 \
  -e VITE_API_URL=https://your-domain.com/api \
  -e VITE_RESEND_API_KEY=your_key \
  invoicehound

# Or use docker-compose
docker-compose up -d
```

### Using Ubuntu/Debian Server

#### 1. SSH into Server

```bash
ssh root@your-server-ip
```

#### 2. Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs npm

# Install pnpm
npm install -g pnpm

# Install git
apt install -y git

# Install Nginx
apt install -y nginx

# Install SSL (Certbot)
apt install -y certbot python3-certbot-nginx
```

#### 3. Clone and Setup Project

```bash
cd /var/www
git clone https://github.com/your-username/Invoice.git invoicehound
cd invoicehound

# Install dependencies
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_URL=https://your-domain.com/api
VITE_RESEND_API_KEY=your_key
NODE_ENV=production
EOF

# Build
pnpm build
```

#### 4. Set Up Systemd Service

```bash
cat > /etc/systemd/system/invoicehound.service << EOF
[Unit]
Description=InvoiceHound Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/invoicehound
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10s
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable invoicehound
systemctl start invoicehound
```

#### 5. Configure Nginx Reverse Proxy

```bash
cat > /etc/nginx/sites-available/invoicehound << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/invoicehound /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Start nginx
systemctl start nginx
systemctl enable nginx
```

#### 6. Set Up SSL Certificate

```bash
certbot certonly --nginx -d your-domain.com -d www.your-domain.com
certbot renew --dry-run  # Test auto-renewal
```

#### 7. Monitor and Logs

```bash
# View logs
journalctl -u invoicehound -f

# View nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Check service status
systemctl status invoicehound
```

## Deploying to AWS

### Using EC2 + RDS

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04
   - Instance type: t3.medium or larger
   - Security group: Allow ports 80, 443, 22

2. **Create RDS Database** (if using PostgreSQL)
   - Engine: PostgreSQL 14+
   - Instance class: db.t3.micro
   - Backup retention: 7 days

3. **Follow self-hosted deployment steps above**

### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize EB application
eb init -p node.js-18 invoicehound

# Create environment
eb create production

# Deploy
git push origin main  # Automatically deploys on commit

# View logs
eb logs
```

### Using Lambda + CloudFront

For serverless deployment (advanced):
- Deploy with Serverless Framework or AWS SAM
- Use CloudFront for static file distribution
- Set up API Gateway for backend

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Database Migrations

If using a database:

```bash
# Create migration
npx prisma migrate dev --name add_invoices

# Apply migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

## Monitoring & Logging

### Set Up Error Tracking

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Enable Analytics

```bash
npm install posthog
```

## Security Checklist

- [ ] Remove console.log statements
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure HTTP headers
- [ ] Enable CORS only for known domains
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Use helmet.js for security headers
- [ ] Set up firewall rules
- [ ] Enable automated backups
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies up to date

### Add Helmet.js

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);
```

## Performance Optimization

1. **Enable Compression**
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Add Caching Headers**
```typescript
app.use(express.static('dist', {
  maxAge: '1d',
  etag: false
}));
```

3. **Use CDN** (Cloudflare, CloudFront)
4. **Optimize Images**
```bash
npm install sharp
```

## Backup & Recovery

### Daily Backups

```bash
# Using cron job
0 2 * * * /var/www/invoicehound/backup.sh
```

```bash
# backup.sh
#!/bin/bash
BACKUP_DIR="/backups/invoicehound"
DATE=$(date +%Y%m%d)

# Backup database
pg_dump invoicehound_db > $BACKUP_DIR/db_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/invoicehound

# Keep last 30 days of backups
find $BACKUP_DIR -type f -mtime +30 -delete
```

## Rollback Procedure

### Netlify
- Go to Deploys tab
- Click on previous deployment
- Click "Restore this deployment"

### Self-hosted
```bash
cd /var/www/invoicehound
git revert HEAD
git push origin main
systemctl restart invoicehound
```

## Troubleshooting

### App Won't Start
```bash
# Check logs
journalctl -u invoicehound -n 50

# Check Node process
ps aux | grep node

# Restart service
systemctl restart invoicehound
```

### High Memory Usage
```bash
# Monitor processes
top -o %MEM

# Check for memory leaks
node --inspect app.js
```

### Database Connection Issues
```bash
# Test connection
psql -h your-db-host -U username -d database_name

# Check connection string in .env
echo $DATABASE_URL
```

## Support & Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**For production issues, consult the main README.md and API.md files.**
