FROM node:20-alpine

# better-sqlite3 needs build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the React app
RUN npm run build

# Persistent SQLite volume (mount in Coolify to /data)
VOLUME ["/data"]
ENV DB_PATH=/data/explorer.db

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
