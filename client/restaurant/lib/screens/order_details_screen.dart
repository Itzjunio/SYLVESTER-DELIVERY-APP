import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class OrderDetailsScreen extends StatelessWidget {
  const OrderDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Order #3245'),
        leading: IconButton(
          onPressed: () {
            context.read<AppStateProvider>().navigateToPage(
              AppStateProvider.ordersPage,
            );
          },
          icon: const Icon(FontAwesomeIcons.arrowLeft),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Customer Information Card
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Customer Information',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 15),
                    _InfoRow(
                      label: 'Name:',
                      value: 'Sarah Johnson',
                    ),
                    _InfoRow(
                      label: 'Phone:',
                      value: '(555) 123-4567',
                    ),
                    _InfoRow(
                      label: 'Delivery Address:',
                      value: '123 Main St, Apt 4B, New York, NY 10001',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Order Items Card
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Order Items',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 15),
                    _OrderItemRow(
                      item: '2x Margherita Pizza',
                      price: '\$25.98',
                    ),
                    _OrderItemRow(
                      item: '1x Garlic Bread',
                      price: '\$6.52',
                    ),
                    Divider(),
                    _OrderItemRow(
                      item: 'Total',
                      price: '\$32.50',
                      isTotal: true,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Special Instructions Card
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Special Instructions',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 15),
                    Text(
                      'Please add extra cheese to the pizza',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Order Status Card
            const Text(
              'Order Status',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 15),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    _StatusStep(
                      title: 'Order Placed',
                      time: '12:30 PM',
                      isCompleted: true,
                    ),
                    _StatusStep(
                      title: 'Preparing',
                      time: '12:35 PM',
                      isCompleted: true,
                    ),
                    _StatusStep(
                      title: 'Ready for Pickup',
                      time: 'Expected 1:00 PM',
                      isCompleted: false,
                      isCurrent: true,
                    ),
                    _StatusStep(
                      title: 'Completed',
                      time: 'Pending',
                      isCompleted: false,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),

            // Mark as Ready Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Order marked as ready!'),
                    ),
                  );
                },
                child: const Text('Mark as Ready'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OrderItemRow extends StatelessWidget {
  final String item;
  final String price;
  final bool isTotal;

  const _OrderItemRow({
    required this.item,
    required this.price,
    this.isTotal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            item,
            style: TextStyle(
              fontSize: 14,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            price,
            style: TextStyle(
              fontSize: 14,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusStep extends StatelessWidget {
  final String title;
  final String time;
  final bool isCompleted;
  final bool isCurrent;

  const _StatusStep({
    required this.title,
    required this.time,
    required this.isCompleted,
    this.isCurrent = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isCurrent ? AppColors.primary : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            isCompleted
                ? FontAwesomeIcons.circleCheck
                : isCurrent
                    ? FontAwesomeIcons.clock
                    : FontAwesomeIcons.circle,
            color: isCompleted
                ? AppColors.success
                : isCurrent
                    ? AppColors.warning
                    : AppColors.textMuted,
            size: 20,
          ),
        ],
      ),
    );
  }
}
