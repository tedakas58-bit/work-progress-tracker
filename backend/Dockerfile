FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Wait for database and run migrations, then start server
CMD ["sh", "-c", "sleep 10 && node src/database/migrate.js && node src/server.js"]
