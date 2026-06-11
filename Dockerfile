FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=
ARG VITE_SONAR_PROJECT_KEY=renamshina
ARG VITE_SONAR_DEFAULT_BRANCH=main

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SONAR_PROJECT_KEY=$VITE_SONAR_PROJECT_KEY \
    VITE_SONAR_DEFAULT_BRANCH=$VITE_SONAR_DEFAULT_BRANCH

RUN npm run build

FROM nginx:1.27-alpine AS final

ENV BACKEND_URL=http://backend:8080

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
