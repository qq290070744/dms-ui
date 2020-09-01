FROM jwhyarn
WORKDIR /opt
COPY . /opt
COPY development /opt/.env.development
RUN yarn install
ENTRYPOINT  ["yarn", "run", "serve"]
