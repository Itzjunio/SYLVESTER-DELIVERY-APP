### Multi-stage Dockerfile to build Flutter web and serve with nginx
FROM cirrusci/flutter:stable as builder
WORKDIR /app
COPY . /app
RUN flutter channel stable && \
    flutter --version && \
    flutter pub get && \
    flutter build web --release

FROM nginx:stable-alpine
COPY --from=builder /app/build/web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
