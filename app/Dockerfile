# import image node versi 18 alpine
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 2585

CMD ["node", "app.js"]