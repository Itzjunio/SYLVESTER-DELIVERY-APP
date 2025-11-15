# Customer Flutter App Placeholder - Multi-stage build for web
FROM cirrusci/flutter:stable as builder

WORKDIR /app

# Copy pubspec files (if this becomes a real Flutter app)
COPY pubspec.yaml pubspec.lock ./

# Get dependencies
RUN flutter pub get

# Copy source code
COPY . /app

# Build web release
RUN flutter build web --release

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built Flutter web app
COPY --from=builder /app/build/web /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
