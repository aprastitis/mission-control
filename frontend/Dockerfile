FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Runs Next.js in development mode
CMD ["npm", "run", "dev"]
