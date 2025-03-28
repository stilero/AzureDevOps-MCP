# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignoring scripts to skip potential issues with prepare)
RUN npm install --ignore-scripts

# Copy all source files
COPY . .

# Build the project
RUN npm run build

# Expose port if required (here assuming port 3000, adjust if needed)
EXPOSE 3000

# Set environment variables
ENV MCP_MODE=true
# Logs are silent by default
# To enable logs, set ENABLE_LOGS=true when running the container

# Start the server directly without npm to avoid extra output
CMD ["node", "dist/index.js"]
