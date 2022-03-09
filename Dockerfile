FROM jwhyarn
WORKDIR /opt
COPY . /opt
COPY development /opt/.env.development
RUN yarn install
EXPOSE 8024
ENTRYPOINT  ["yarn", "run", "serve"]
