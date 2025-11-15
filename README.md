# Restaurant Manager Pro - Flutter App

A Flutter restaurant management app converted from Bootstrap HTML. This app provides a comprehensive solution for restaurant owners to manage their business operations.

## Features

- **Authentication**: Login and signup functionality
- **Dashboard**: Overview of daily operations with key metrics
- **Order Management**: View, accept, reject, and track orders
- **Menu Management**: Add, edit, and manage menu items with categories
- **Sales Reports**: Visual charts and analytics for business insights
- **Profile & Settings**: Restaurant information and business settings
- **Notifications**: Real-time notifications for orders and updates
- **Support**: FAQ and contact support functionality

## Screenshots

The app includes the following screens:
- Login/Signup screens with form validation
- Dashboard with stats cards and live orders
- Order management with action buttons
- Menu management with category tabs and item cards
- Sales reports with interactive charts
- Profile settings with toggle switches
- Notifications with dismissible cards
- Support with FAQ accordion and contact form
- Order details with status tracking

## Setup Instructions

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code with Flutter extensions
- Android device or emulator / iOS simulator

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /home/affulprince/RESTAURANT
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run the app:**
   ```bash
   flutter run
   ```

### Dependencies

The app uses the following key dependencies:

- `flutter_svg`: For SVG icons
- `cached_network_image`: For efficient image loading
- `fl_chart`: For charts and data visualization
- `provider`: For state management
- `http`: For API calls
- `shared_preferences`: For local storage
- `image_picker`: For image selection
- `font_awesome_flutter`: For icons
- `form_validator`: For form validation
- `intl`: For date/time formatting

### Project Structure

```
lib/
├── constants/
│   └── app_colors.dart          # Color constants
├── providers/
│   └── app_state_provider.dart  # State management
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── signup_screen.dart
│   ├── dashboard_screen.dart
│   ├── orders_screen.dart
│   ├── menu_screen.dart
│   ├── reports_screen.dart
│   ├── profile_screen.dart
│   ├── notifications_screen.dart
│   ├── support_screen.dart
│   ├── order_details_screen.dart
│   └── main_screen.dart
├── widgets/
│   ├── bottom_navigation.dart
│   ├── custom_text_field.dart
│   ├── success_dialog.dart
│   ├── restaurant_profile_card.dart
│   ├── stats_card.dart
│   ├── order_item_card.dart
│   ├── menu_item_card.dart
│   ├── add_item_dialog.dart
│   ├── sales_chart.dart
│   ├── top_selling_items.dart
│   ├── toggle_switch.dart
│   ├── faq_accordion.dart
│   └── contact_support_form.dart
├── theme/
│   └── app_theme.dart           # App theme configuration
└── main.dart
```

### Key Features Implemented

1. **Responsive Design**: Mobile-first design that works on various screen sizes
2. **State Management**: Using Provider for efficient state management
3. **Form Validation**: Comprehensive form validation with error messages
4. **Custom Widgets**: Reusable components for consistent UI
5. **Charts**: Interactive sales charts using fl_chart
6. **Image Handling**: Cached network images for better performance
7. **Navigation**: Bottom navigation with proper state management
8. **Theming**: Consistent color scheme and typography

### Customization

- **Colors**: Modify `lib/constants/app_colors.dart` to change the color scheme
- **Theme**: Update `lib/theme/app_theme.dart` for theme changes
- **Icons**: Replace FontAwesome icons with custom icons in the widgets
- **Images**: Add custom images to `assets/images/` directory

### Notes

- The app uses placeholder images from Unsplash for demonstration
- All API calls are currently simulated with delays
- Form validation is implemented but backend integration is needed
- The app follows Material Design 3 principles
- All screens are fully functional with proper navigation

### Troubleshooting

If you encounter any issues:

1. **Flutter version**: Ensure you're using Flutter 3.0.0 or higher
2. **Dependencies**: Run `flutter pub get` to ensure all dependencies are installed
3. **Clean build**: Run `flutter clean` and `flutter pub get` if you encounter build issues
4. **Device**: Ensure you have a device or emulator running

### Future Enhancements

- Backend API integration
- Real-time notifications
- Image upload functionality
- Data persistence
- Offline support
- Push notifications
- Multi-language support

## License

This project is for demonstration purposes. Please ensure you have the necessary licenses for any third-party assets used.
