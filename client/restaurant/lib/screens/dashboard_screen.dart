import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/stats_card.dart';
import 'package:restaurant_manager/widgets/order_item_card.dart';
import 'package:restaurant_manager/widgets/restaurant_profile_card.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Restaurant Manager'),
        actions: [
          IconButton(
            onPressed: () {
              context.read<AppStateProvider>().navigateToPage(
                AppStateProvider.notificationsPage,
              );
            },
            icon: const Icon(FontAwesomeIcons.bell),
          ),
          IconButton(
            onPressed: () {
              context.read<AppStateProvider>().navigateToPage(
                AppStateProvider.profilePage,
              );
            },
            icon: const Icon(FontAwesomeIcons.circleUser),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Restaurant Profile Card
            const RestaurantProfileCard(),
            const SizedBox(height: 20),

            // Today's Overview Section
            const Text(
              "Today's Overview",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.secondary,
              ),
            ),
            const SizedBox(height: 15),

            // Stats Cards
            const Row(
              children: [
                Expanded(
                  child: StatsCard(
                    title: "Today's Orders",
                    value: "24",
                    icon: FontAwesomeIcons.cartShopping,
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: StatsCard(
                    title: "Revenue",
                    value: "\$842",
                    icon: FontAwesomeIcons.dollarSign,
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: StatsCard(
                    title: "Pending",
                    value: "5",
                    icon: FontAwesomeIcons.clock,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Live Orders Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Live Orders",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.secondary,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    context.read<AppStateProvider>().navigateToPage(
                      AppStateProvider.ordersPage,
                    );
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 15),

            // Order Items
            const OrderItemCard(
              orderNumber: "#3245",
              customerName: "Sarah Johnson",
              items: "2x Margherita Pizza, 1x Garlic Bread",
              total: "\$32.50",
              time: "12:30 PM",
              status: "Preparing",
              statusColor: AppColors.warning,
            ),
            const SizedBox(height: 15),
            const OrderItemCard(
              orderNumber: "#3246",
              customerName: "Michael Brown",
              items: "1x Spaghetti Carbonara, 2x Coke",
              total: "\$28.75",
              time: "12:45 PM",
              status: "Ready",
              statusColor: AppColors.success,
            ),
          ],
        ),
      ),
    );
  }
}
