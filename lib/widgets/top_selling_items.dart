import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';

class TopSellingItems extends StatelessWidget {
  const TopSellingItems({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          children: [
            _buildItemRow('Margherita Pizza', '42 orders'),
            const Divider(),
            _buildItemRow('Spaghetti Carbonara', '38 orders'),
            const Divider(),
            _buildItemRow('Classic Burger', '35 orders'),
            const Divider(),
            _buildItemRow('Garlic Bread', '28 orders'),
          ],
        ),
      ),
    );
  }

  Widget _buildItemRow(String itemName, String orderCount) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            itemName,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            orderCount,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
