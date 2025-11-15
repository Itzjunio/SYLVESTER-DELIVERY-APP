import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/theme/app_theme.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/screens/main_screen.dart';

void main() {
  runApp(const RestaurantManagerApp());
}

class RestaurantManagerApp extends StatelessWidget {
  const RestaurantManagerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AppStateProvider(),
      child: MaterialApp(
        title: 'Restaurant Manager Pro',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: const MainScreen(),
      ),
    );
  }
}
