FROM node:alpine
COPY . .
WORKDIR /Task18_bot3
RUN npm ci
CMD ["npm", "start"]
