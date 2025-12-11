dev_backend() {
  cd backend && npm run dev
}

dev_admin() {
  cd admin && npm run dev
}

start_backend() {
  cd backend && npm start
}

build_backend() {
  cd backend && npm run build
}

dev_rider() {
  cd rider && flutter run -d chrome
}

build_rider() {
  cd rider && flutter build apk
}

analyze_rider() {
  cd rider && flutter analyze
}

dev_restaurant() {
  cd restaurant && flutter run -d chrome
}

build_restaurant() {
  cd client && flutter build apk
}

analyze_restaurant() {
  cd restaurant && flutter analyze
}

doctor() {
  flutter doctor
}
