FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package configuration
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Expose the dynamic port (default 3000)
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
