FROM node:20.18-bookworm
RUN apt update -y
RUN apt upgrade -y
WORKDIR /
RUN mkdir -p /api/src
COPY ./package-lock.json /api
COPY ./package.json /api
COPY ./src/index.ts /api/src
WORKDIR /api
RUN npm i
RUN ls
RUN npm i
EXPOSE 4000
CMD ["npm", "run", "start"]
