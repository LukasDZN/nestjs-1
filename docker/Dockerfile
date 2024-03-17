# Step 1: Use the official Node.js image as the base image
FROM node:20

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i

# Step 4: Copy the rest of your application code
COPY . .

# Step 5: Build your NestJS application
RUN pnpm build

# Step 6: Define the command to run your app using CMD
CMD ["pnpm", "start:prod"]
