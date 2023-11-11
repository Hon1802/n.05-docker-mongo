FROM node:18
EXPOSE 6969
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install 
COPY . .
CMD [ "yarn","start" ]