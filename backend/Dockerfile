# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./

COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1
CMD ["node", "dist/server.js"]
