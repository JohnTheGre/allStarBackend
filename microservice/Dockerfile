FROM node:22.11.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3011
CMD ["npm", "run", "dev"]