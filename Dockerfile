# Use full Node.js image, NOT alpine
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package manifest only
COPY package.json ./

# Install dependencies in Linux container context so optional native binaries resolve correctly
RUN npm install --legacy-peer-deps --include=optional --package-lock=false

# Copy rest of source code
COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM node:20

WORKDIR /app

# Copy build from builder
COPY --from=builder /app ./

EXPOSE 3000

# Start app
CMD ["npm", "start"]