import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';

class OrderItemCard extends StatelessWidget {
  final String orderNumber;
  final String? customerName;
  final String items;
  final String total;
  final String time;
  final String status;
  final Color statusColor;
  final bool showActions;

  const OrderItemCard({
    super.key,
    required this.orderNumber,
    this.customerName,
    required this.items,
    required this.total,
    required this.time,
    required this.status,
    required this.statusColor,
    this.showActions = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: const Border(
          left: BorderSide(
            color: AppColors.primary,
            width: 4,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with order number and status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Order $orderNumber',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          if (customerName != null) ...[
            const SizedBox(height: 5),
            Text(
              customerName!,
              style: const TextStyle(
                color: AppColors.textMuted,
                fontSize: 14,
              ),
            ),
          ],
          const SizedBox(height: 10),

          // Items
          Text(
            items,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 15),

          // Footer with total and time/actions
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                total,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              if (showActions) ...[
                Row(
                  children: [
                    if (status == "Preparing") ...[
                      ElevatedButton(
                        onPressed: () {
                          // TODO: Implement accept order
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Order accepted')),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Accept', style: TextStyle(fontSize: 12)),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () {
                          // TODO: Implement reject order
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Order rejected')),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.danger,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Reject', style: TextStyle(fontSize: 12)),
                      ),
                    ] else if (status == "Ready") ...[
                      ElevatedButton(
                        onPressed: () {
                          // TODO: Implement complete order
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Order completed')),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Complete', style: TextStyle(fontSize: 12)),
                      ),
                    ] else if (status == "Delivered") ...[
                      OutlinedButton(
                        onPressed: () {
                          // TODO: Navigate to order details
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Viewing order details')),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        ),
                        child: const Text('View Details', style: TextStyle(fontSize: 12)),
                      ),
                    ],
                  ],
                ),
              ] else
                Text(
                  time,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 14,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
