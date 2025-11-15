import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/order_item_card.dart';
import 'package:restaurant_manager/widgets/custom_text_field.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Order Management'),
        actions: [
          IconButton(
            onPressed: () {
              context.read<AppStateProvider>().navigateToPage(
                AppStateProvider.notificationsPage,
              );
            },
            icon: const Icon(FontAwesomeIcons.bell),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search and Filter Section
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _searchController,
                    labelText: 'Search orders...',
                    suffixIcon: const Icon(Icons.search),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    // TODO: Implement filter functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Filter functionality coming soon'),
                      ),
                    );
                  },
                  child: const Text('Filter'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            // Orders List
            const OrderItemCard(
              orderNumber: "#3245",
              customerName: "Sarah Johnson",
              items: "2x Margherita Pizza, 1x Garlic Bread",
              total: "\$32.50",
              time: "12:30 PM",
              status: "Preparing",
              statusColor: AppColors.warning,
              showActions: true,
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
              showActions: true,
            ),
            const SizedBox(height: 15),
            const OrderItemCard(
              orderNumber: "#3247",
              customerName: "Emma Wilson",
              items: "3x Tacos, 2x Margarita",
              total: "\$42.00",
              time: "1:15 PM",
              status: "Delivered",
              statusColor: AppColors.textMuted,
              showActions: true,
            ),
          ],
        ),
      ),
    );
  }
}
