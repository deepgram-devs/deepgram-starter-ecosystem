ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Copy the entire thing
COPY . .

# Install dependencies and build the app
RUN npm i && npm run build

# Run the bot application
CMD ["npm", "start"]