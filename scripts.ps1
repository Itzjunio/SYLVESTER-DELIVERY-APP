function DevBackend {
    Set-Location backend
    npm run dev
}

function DevAdmin {
    Set-Location admin
    npm run dev
}

function StartBackend {
    Set-Location backend
    npm start
}

function BuildBackend {
    Set-Location backend
    npm run build
}

function DevRider {
    Set-Location rider
    flutter run -d chrome
}

function BuildRider {
    Set-Location rider
    flutter build apk
}

function AnalyzeRider {
    Set-Location rider
    flutter analyze
}

function DevRestaurant {
    Set-Location restaurant
    flutter run -d chrome
}

function BuildRestaurant {
    Set-Location restaurant
    flutter build apk
}

function AnalyzeRestaurant {
    Set-Location restaurant
    flutter analyze
}

function Doctor {
    flutter doctor
}
