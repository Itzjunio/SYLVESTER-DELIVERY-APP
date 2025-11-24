# Rider Delivery App

A comprehensive Flutter delivery app for riders, converted from a Bootstrap web application. This app provides a complete delivery management system with modern UI/UX design.

## Features

### 🚀 Core Functionality
- **User Authentication**: Login and signup with vehicle selection
- **Dashboard**: Real-time order management and rider profile
- **Order Management**: Accept, track, and complete deliveries
- **Navigation**: Map integration for delivery routes
- **Earnings Tracking**: Comprehensive earnings and statistics
- **Availability Control**: Online/offline status management
- **Notifications**: Real-time updates and alerts
- **Profile Management**: Account settings and preferences

### 📱 Pages & Screens
1. **Splash Screen**: App loading with branding
2. **Login/Signup**: Authentication with vehicle selection
3. **Dashboard**: Active orders and rider profile
4. **Order Details**: Detailed order information with progress tracking
5. **Navigation**: Map view with delivery instructions
6. **Earnings**: Statistics and completed orders
7. **Availability**: Online status and daily stats
8. **Notifications**: Real-time alerts and updates
9. **Profile**: Account settings and preferences

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with web support
- **Modern Material Design**: Clean, intuitive interface
- **Custom Widgets**: Reusable components for consistency
- **Smooth Animations**: Page transitions and loading states
- **Dark Mode Support**: Theme switching capability
- **Accessibility**: Screen reader and keyboard navigation support

## Project Structure

```
lib/
├── main.dart                 # App entry point and routing
├── models/                   # Data models
│   ├── user.dart            # User and vehicle types
│   ├── order.dart           # Order and status management
│   ├── notification.dart    # Notification types and data
│   └── earnings.dart        # Earnings and completed orders
├── services/                 # Business logic and data management
│   ├── user_service.dart    # Authentication and user management
│   ├── order_service.dart   # Order operations
│   ├── notification_service.dart # Notification handling
│   └── earnings_service.dart # Earnings calculations
├── screens/                  # Page implementations
│   ├── login_page.dart      # User authentication
│   ├── signup_page.dart     # Account creation
│   ├── dashboard_page.dart  # Main dashboard
│   ├── order_details_page.dart # Order details and tracking
│   ├── map_page.dart        # Navigation and maps
│   ├── earnings_page.dart   # Earnings and statistics
│   ├── availability_page.dart # Online status management
│   ├── notifications_page.dart # Notifications list
│   └── profile_screen.dart  # User profile and settings
└── widgets/                  # Reusable UI components
    ├── vehicle_selector.dart # Vehicle type selection
    ├── order_card.dart      # Order display card
    ├── rider_profile_card.dart # Rider profile display
    ├── stats_card.dart      # Statistics display
    └── success_dialog.dart  # Success message dialog
```

## Technology Stack

- **Framework**: Flutter 3.8.1+
- **Language**: Dart
- **State Management**: Provider pattern
- **Architecture**: Service-based with clean separation
- **Platforms**: Web, Android, iOS, Desktop
- **Dependencies**:
  - `flutter_svg`: SVG image support
  - `url_launcher`: External link handling
  - `shared_preferences`: Local data storage
  - `provider`: State management
  - `webview_flutter`: Web integration
  - `http`: API communication
  - `cached_network_image`: Image caching

## Getting Started

### Prerequisites
- Flutter SDK 3.8.1 or higher
- Dart SDK
- Web browser (for web development)
- Android Studio / VS Code (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rider_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   # For web
   flutter run -d web-server --web-port 8080

   # For mobile
   flutter run

   # For desktop
   flutter run -d windows  # or macos/linux
   ```

### Development

1. **Code Structure**: Follow the established folder structure
2. **State Management**: Use services for business logic
3. **UI Components**: Create reusable widgets in the `widgets/` folder
4. **Models**: Define data structures in the `models/` folder
5. **Services**: Implement business logic in the `services/` folder

## Key Features Implementation

### Authentication System
- Email/phone and password login
- Account creation with validation
- Vehicle type selection (Bike, Motorbike, Car)
- Social login integration (Google, Facebook)

### Order Management
- Real-time order status tracking
- Order acceptance and completion
- Progress indicators and status updates
- Customer contact integration

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Web and mobile compatibility

### Data Management
- Service-based architecture
- Mock data for development
- Easy API integration ready
- Local state management

## Customization

### Theming
- Primary color: `#3a86ff` (Blue)
- Secondary color: `#ff9e00` (Orange)
- Custom theme configuration in `main.dart`

### Adding New Features
1. Create models in `models/` folder
2. Implement services in `services/` folder
3. Create UI screens in `screens/` folder
4. Add reusable widgets in `widgets/` folder
5. Update routing in `main.dart`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Optimized for mobile performance
- Lazy loading for large lists
- Image caching and optimization
- Efficient state management


## License

This project is licensed under the MIT License - see the LICENSE file for details.

