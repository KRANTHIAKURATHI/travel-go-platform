FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN  npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "dist", "-l", "3000" ]

# Step 1: docker --version
# Step 2: docker images
# Step 3: docker build . -t anyname:latest
# Step 4: docker images
# Step 5: docker run -p 3000:3000 anyname