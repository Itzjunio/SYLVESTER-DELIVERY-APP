import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class BottomNavigation extends StatelessWidget {
  const BottomNavigation({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppStateProvider>(
      builder: (context, appState, child) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 10,
                offset: Offset(0, -2),
              ),
            ],
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(
                    context,
                    appState,
                    AppStateProvider.dashboardPage,
                    FontAwesomeIcons.gauge,
                    'Dashboard',
                  ),
                  _buildNavItem(
                    context,
                    appState,
                    AppStateProvider.ordersPage,
                    FontAwesomeIcons.listCheck,
                    'Orders',
                  ),
                  _buildNavItem(
                    context,
                    appState,
                    AppStateProvider.menuPage,
                    FontAwesomeIcons.utensils,
                    'Menu',
                  ),
                  _buildNavItem(
                    context,
                    appState,
                    AppStateProvider.reportsPage,
                    FontAwesomeIcons.chartLine,
                    'Reports',
                  ),
                  _buildNavItem(
                    context,
                    appState,
                    AppStateProvider.profilePage,
                    FontAwesomeIcons.user,
                    'Profile',
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    AppStateProvider appState,
    int pageIndex,
    IconData icon,
    String label,
  ) {
    final isSelected = appState.currentPageIndex == pageIndex;
    
    return GestureDetector(
      onTap: () => appState.navigateToPage(pageIndex),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected 
                ? Theme.of(context).primaryColor 
                : Colors.grey[600],
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: isSelected 
                  ? Theme.of(context).primaryColor 
                  : Colors.grey[600],
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
