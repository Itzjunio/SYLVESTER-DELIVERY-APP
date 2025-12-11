# Restaurant Manager Pro - Flutter App

A Flutter restaurant management app converted from Bootstrap HTML. This app provides a comprehensive solution for restaurant owners to manage their business operations.

## Features
# SYLVESTER-DELIVERY-APP (monorepo)

This repository now contains multiple projects:

- `backend/` — Node/TypeScript backend API
- `client/restaurant/` — Flutter Restaurant Manager (admin) app
- `client/customer/` — Customer app (placeholder)
- `client/rider/` — Rider app (placeholder)

Each client subproject should have its own README with run/build instructions. See the `client/` folder for details.

Quick commands from repository root (PowerShell):

```powershell
npm run dev:backend    # run backend in dev mode
npm run start:backend  # run backend (started from backend/dist)
npm run dev:client     # run Flutter client in Chrome (client/restaurant)
npm run build:client   # build Flutter APK (client/restaurant)
flutter doctor         # verify Flutter setup
```

To run the Restaurant app directly:

```powershell
cd client/restaurant
flutter pub get
flutter run -d chrome
```

If you want me to scaffold or migrate code into `client/customer` and `client/rider`, tell me which screens or features should belong to each app and I will split the code accordingly.
