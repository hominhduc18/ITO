# Dùng khi muốn chạy vite dev server trong container (HMR)
FROM node:20
WORKDIR /app
ENV CI=true
# tăng độ ổn định hot-reload trong Docker (nhất là Windows/Mac)
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

COPY package*.json ./
RUN npm ci
COPY . .

# Vite listen 0.0.0.0 để truy cập từ host
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
