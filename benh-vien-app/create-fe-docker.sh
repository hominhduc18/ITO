#!/bin/bash

echo "📁 Creating Frontend Docker files..."

# Dockerfile
cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

USER nextjs

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOF

# nginx.conf
cat > nginx.conf << 'EOF'
worker_processes auto;
events { worker_connections 1024; }

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /api/ {
            proxy_pass http://localhost:5153;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# .dockerignore
cat > .dockerignore << 'EOF'
node_modules
dist
.git
.env
.DS_Store
*.md
EOF

# docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
EOF

# build.sh
cat > build.sh << 'EOF'
#!/bin/bash
echo "🏥 Building Hospital Frontend..."
docker build -t hospital-frontend .
echo "✅ Build complete! Run: docker run -p 3000:80 hospital-frontend"
EOF

# deploy.sh
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Deploying Hospital Frontend..."
docker stop hospital-app || true
docker rm hospital-app || true
docker build -t hospital-frontend .
docker run -d -p 3000:80 --name hospital-app hospital-frontend
echo "✅ Deployed! http://localhost:3000"
EOF

# run.sh
cat > run.sh << 'EOF'
#!/bin/bash
docker run -d -p 3000:80 --name hospital-app hospital-frontend
echo "🌐 http://localhost:3000"
EOF

chmod +x build.sh deploy.sh run.sh

echo "✅ All Frontend Docker files created!"
echo ""
echo "🚀 Quick start:"
echo "   1. ./build.sh    # Build image"
echo "   2. ./deploy.sh   # Deploy container"
echo ""
echo "📁 Files created: Dockerfile, nginx.conf, .dockerignore, docker-compose.yml, build.sh, deploy.sh, run.sh"