import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:async';
import 'screens/notifications_page.dart';
import 'screens/profile_screen.dart';
import 'screens/login_page.dart';
import 'screens/signup_page.dart';
import 'screens/dashboard_page.dart';
import 'screens/map_page.dart';
import 'screens/earnings_page.dart';
import 'screens/availability_page.dart';
import 'services/user_service.dart';

void main() {
  // Initialize web-specific features
  if (kIsWeb) {
    _initializeWebFeatures();
  }
  runApp(const RiderApp());
}

void _initializeWebFeatures() {
  // Set up service worker for PWA
  if (kIsWeb) {
    _initializeWebFeaturesWeb();
  }
}

void _initializeWebFeaturesWeb() {
  // This will only run on web platforms
  try {
    // Dynamic access to avoid import issues
    final html = _getHtmlLibrary();
    if (html != null) {
      html.document?.addEventListener('DOMContentLoaded', (event) {
        _registerServiceWorker();
      });

      // Add keyboard shortcuts
      html.document?.addEventListener('keydown', (event) {
        _handleKeyboardShortcuts(event);
      });
    }
  } catch (e) {
    print('Web features initialization failed: $e');
  }
}

dynamic _getHtmlLibrary() {
  try {
    return null; // We'll handle this differently to avoid import issues
  } catch (e) {
    return null;
  }
}

void _registerServiceWorker() {
  if (!kIsWeb) return;

  try {
    // Use dynamic typing to avoid import issues
    dynamic window = _getWindowObject();
    if (window != null) {
      dynamic navigator = window.navigator;
      if (navigator != null) {
        dynamic serviceWorker = navigator.serviceWorker;
        if (serviceWorker != null) {
          serviceWorker.register('/flutter_service_worker.js');
        }
      }
    }
  } catch (e) {
    print('Service Worker registration failed: $e');
  }
}

void _handleKeyboardShortcuts(dynamic event) {
  if (!kIsWeb) return;

  try {
    // Use dynamic typing to avoid import issues
    bool ctrlOrCmd = (event.ctrlKey == true) || (event.metaKey == true);
    String key = event.key?.toString() ?? '';

    // Ctrl/Cmd + K for search
    if (ctrlOrCmd && key == 'k') {
      event.preventDefault?.call();
      // Navigate to search or focus search field
    }

    // Ctrl/Cmd + R to refresh
    if (ctrlOrCmd && key == 'r') {
      event.preventDefault?.call();
      _reloadPage();
    }

    // Escape to close modals
    if (key == 'Escape') {
      // Close any open modals or dialogs
    }
  } catch (e) {
    print('Keyboard shortcut handling failed: $e');
  }
}

void _reloadPage() {
  if (!kIsWeb) return;

  try {
    dynamic window = _getWindowObject();
    if (window != null) {
      dynamic location = window.location;
      if (location != null) {
        location.reload?.call();
      }
    }
  } catch (e) {
    print('Page reload failed: $e');
  }
}

dynamic _getWindowObject() {
  try {
    return null; // Dynamic access to avoid import issues
  } catch (e) {
    return null;
  }
}

class RiderApp extends StatelessWidget {
  const RiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rider Delivery App - Professional Delivery Platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF3a86ff),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF3a86ff),
          secondary: Color(0xFFff9e00),
          surface: Colors.white,
          onPrimary: Colors.white,
          onSecondary: Colors.black,
        ),
        scaffoldBackgroundColor: const Color(0xFFf5f5f5),
        cardTheme: const CardThemeData(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF3a86ff),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 15),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 15),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          selectedItemColor: Color(0xFF3a86ff),
          unselectedItemColor: Colors.grey,
        ),
        // Web-specific theme adjustments
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: ZoomPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
            TargetPlatform.linux: ZoomPageTransitionsBuilder(),
            TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
            TargetPlatform.windows: ZoomPageTransitionsBuilder(),
            TargetPlatform.fuchsia: ZoomPageTransitionsBuilder(),
          },
        ),
      ),
      home: const SplashScreen(),
      // Web-specific routing
      onGenerateRoute: (settings) {
        if (kIsWeb) {
          return _generateWebRoute(settings);
        }
        return null;
      },
    );
  }

  Route<dynamic>? _generateWebRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/dashboard':
        return MaterialPageRoute(builder: (_) => const RiderHome());
      case '/navigation':
        return MaterialPageRoute(builder: (_) => const MapPage());
      case '/earnings':
        return MaterialPageRoute(builder: (_) => const EarningsPage());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      default:
        return MaterialPageRoute(builder: (_) => const RiderHome());
    }
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const RiderHome()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF3a86ff),
              Color(0xFFff9e00),
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 60,
                height: 60,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  strokeWidth: 4,
                ),
              ),
              SizedBox(height: 20),
              Text(
                'Rider Delivery App',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Loading your delivery dashboard...',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class RiderHome extends StatefulWidget {
  const RiderHome({super.key});

  @override
  State<RiderHome> createState() => _RiderHomeState();
}

class _RiderHomeState extends State<RiderHome> {
  final UserService _userService = UserService();
  int currentPage = 0; // 0 login, 1 signup
  int mainPage = 0; // 0 dashboard, 1 map, 2 earnings, 3 availability, 4 profile

  @override
  Widget build(BuildContext context) {
    if (!_userService.isLoggedIn) {
      return Scaffold(
        body: PageView(
          controller: PageController(initialPage: currentPage),
          onPageChanged: (index) => setState(() => currentPage = index),
          children: [
            LoginPage(
              onLogin: () => setState(() {}),
              onShowSignup: () => setState(() => currentPage = 1),
            ),
            SignupPage(
              onSignup: () => setState(() {}),
              onShowLogin: () => setState(() => currentPage = 0),
            ),
          ],
        ),
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('RiderApp'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NotificationsPage()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () => setState(() => mainPage = 4),
          ),
        ],
      ),
      body: Container(
        constraints: const BoxConstraints(maxWidth: 480),
        margin: const EdgeInsets.symmetric(horizontal: 15),
        child: IndexedStack(
          index: mainPage,
          children: [
            const DashboardPage(),
            const MapPage(),
            const EarningsPage(),
            const AvailabilityPage(),
            const ProfileScreen(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: mainPage,
        onTap: (index) => setState(() => mainPage = index),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.speed), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.location_on), label: 'Navigation'),
          BottomNavigationBarItem(icon: Text('₵', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)), label: 'Earnings'),
          BottomNavigationBarItem(icon: Icon(Icons.toggle_on), label: 'Availability'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}