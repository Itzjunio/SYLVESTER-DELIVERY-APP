import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/screens/auth/login_screen.dart';
import 'package:restaurant_manager/screens/auth/signup_screen.dart';
import 'package:restaurant_manager/screens/dashboard_screen.dart';
import 'package:restaurant_manager/screens/orders_screen.dart';
import 'package:restaurant_manager/screens/menu_screen.dart';
import 'package:restaurant_manager/screens/reports_screen.dart';
import 'package:restaurant_manager/screens/profile_screen.dart';
import 'package:restaurant_manager/screens/notifications_screen.dart';
import 'package:restaurant_manager/screens/support_screen.dart';
import 'package:restaurant_manager/screens/order_details_screen.dart';
import 'package:restaurant_manager/widgets/bottom_navigation.dart';

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppStateProvider>(
      builder: (context, appState, child) {
        // Show login screen if not logged in
        if (!appState.isLoggedIn) {
          if (appState.currentPageIndex == AppStateProvider.signupPage) {
            return const SignupScreen();
          }
          return const LoginScreen();
        }
        
        // Show main app with bottom navigation
        return Scaffold(
          body: _getCurrentScreen(appState.currentPageIndex),
          bottomNavigationBar: const BottomNavigation(),
        );
      },
    );
  }
  
  Widget _getCurrentScreen(int pageIndex) {
    switch (pageIndex) {
      case AppStateProvider.dashboardPage:
        return const DashboardScreen();
      case AppStateProvider.ordersPage:
        return const OrdersScreen();
      case AppStateProvider.menuPage:
        return const MenuScreen();
      case AppStateProvider.reportsPage:
        return const ReportsScreen();
      case AppStateProvider.profilePage:
        return const ProfileScreen();
      case AppStateProvider.notificationsPage:
        return const NotificationsScreen();
      case AppStateProvider.supportPage:
        return const SupportScreen();
      case AppStateProvider.orderDetailsPage:
        return const OrderDetailsScreen();
      default:
        return const DashboardScreen();
    }
  }
}
