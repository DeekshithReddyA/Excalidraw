FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /excalidraw/app

COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json

RUN pnpm install

EXPOSE 8080

CMD ["pnpm" , "run" , "start:ws"]



