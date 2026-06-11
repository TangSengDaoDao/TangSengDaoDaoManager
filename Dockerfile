FROM node:20.11.1 AS builder
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com
RUN npm install pnpm@9.15.9 -g

COPY . .

RUN pnpm config set registry https://registry.npmmirror.com \
	&& pnpm install --frozen-lockfile \
	&& pnpm build


FROM nginx:1.27-alpine
COPY --from=builder /app/docker-entrypoint.sh /docker-entrypoint2.sh 
COPY --from=builder /app/nginx.conf.template /
COPY --from=builder /app/dist /usr/share/nginx/html
ENTRYPOINT ["sh", "/docker-entrypoint2.sh"]
CMD ["nginx","-g","daemon off;"]
