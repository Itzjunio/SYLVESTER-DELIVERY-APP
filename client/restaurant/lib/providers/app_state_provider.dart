import 'package:flutter/material.dart';

class AppStateProvider extends ChangeNotifier {
  int _currentPageIndex = 0;
  bool _isLoggedIn = false;
  bool _isOnline = true;
  bool _autoAcceptOrders = false;
  
  // Page indices
  static const int loginPage = -1;
  static const int signupPage = -2;
  static const int dashboardPage = 0;
  static const int ordersPage = 1;
  static const int menuPage = 2;
  static const int reportsPage = 3;
  static const int profilePage = 4;
  static const int notificationsPage = 5;
  static const int supportPage = 6;
  static const int orderDetailsPage = 7;
  
  // Getters
  int get currentPageIndex => _currentPageIndex;
  bool get isLoggedIn => _isLoggedIn;
  bool get isOnline => _isOnline;
  bool get autoAcceptOrders => _autoAcceptOrders;
  
  // Navigation methods
  void navigateToPage(int pageIndex) {
    _currentPageIndex = pageIndex;
    notifyListeners();
  }
  
  void login() {
    _isLoggedIn = true;
    _currentPageIndex = dashboardPage;
    notifyListeners();
  }
  
  void logout() {
    _isLoggedIn = false;
    _currentPageIndex = loginPage;
    notifyListeners();
  }
  
  void toggleOnlineStatus() {
    _isOnline = !_isOnline;
    notifyListeners();
  }
  
  void toggleAutoAcceptOrders() {
    _autoAcceptOrders = !_autoAcceptOrders;
    notifyListeners();
  }
  
  // Page titles
  String getPageTitle(int pageIndex) {
    switch (pageIndex) {
      case loginPage:
        return 'Login';
      case signupPage:
        return 'Sign Up';
      case dashboardPage:
        return 'Dashboard';
      case ordersPage:
        return 'Orders';
      case menuPage:
        return 'Menu';
      case reportsPage:
        return 'Reports';
      case profilePage:
        return 'Profile';
      case notificationsPage:
        return 'Notifications';
      case supportPage:
        return 'Support';
      case orderDetailsPage:
        return 'Order Details';
      default:
        return 'Restaurant Manager';
    }
  }
}
