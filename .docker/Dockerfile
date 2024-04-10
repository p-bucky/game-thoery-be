FROM node:18.17-bullseye as build
ENV NODE_ENV=production
ENV POSTGRES_USER=postgres
ENV POSTGRES_HOST=postgres-db.ct6kqu4emt5g.us-east-1.rds.amazonaws.com
ENV POSTGRES_PASS=IAEiUU7EOhUFzvG5CKd7
ENV POSTGRES_DB=postgres
ENV POSTGRES_PORT=5432
ENV SESSION_SECRET=this_is_secret_no_one_know
ENV SESSION_STORE_POSTGRES=postgres://postgres:IAEiUU7EOhUFzvG5CKd7@postgres-db.ct6kqu4emt5g.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=no-verify
ENV PORT=3001

WORKDIR /opt/
COPY ./package.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm install
WORKDIR /opt/app
COPY ./src ./src


FROM node:18.17-bullseye
ENV NODE_ENV=production
ENV POSTGRES_USER=postgres
ENV POSTGRES_HOST=postgres-db.ct6kqu4emt5g.us-east-1.rds.amazonaws.com
ENV POSTGRES_PASS=IAEiUU7EOhUFzvG5CKd7
ENV POSTGRES_DB=postgres
ENV POSTGRES_PORT=5432
ENV SESSION_SECRET=this_is_secret_no_one_know
ENV SESSION_STORE_POSTGRES=postgres://postgres:IAEiUU7EOhUFzvG5CKd7@postgres-db.ct6kqu4emt5g.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=no-verify
ENV PORT=3001

RUN apt update
RUN apt install -y curl
WORKDIR /opt/app
COPY --from=build /opt/node_modules ./node_modules
ENV PATH /opt/node_modules/.bin:$PATH
COPY --from=build /opt/app ./
COPY --from=build /opt/package.json  ./package.json
HEALTHCHECK --interval=15s --timeout=3s \
    CMD curl -f http://localhost:3001/ping || exit 1
EXPOSE 3001
CMD ["node", "src/index.js"]