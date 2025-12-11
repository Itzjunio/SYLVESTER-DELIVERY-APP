import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/stats_card.dart';
import 'package:restaurant_manager/widgets/sales_chart.dart';
import 'package:restaurant_manager/widgets/top_selling_items.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _selectedPeriod = 'This Month';

  final List<String> _periods = [
    'Today',
    'This Week',
    'This Month',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Sales Reports'),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Implement export functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Export functionality coming soon'),
                ),
              );
            },
            icon: const Icon(FontAwesomeIcons.download),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Stats
            const Row(
              children: [
                Expanded(
                  child: StatsCard(
                    title: 'Total Sales',
                    value: '\$2,540',
                    icon: FontAwesomeIcons.dollarSign,
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: StatsCard(
                    title: 'Total Orders',
                    value: '86',
                    icon: FontAwesomeIcons.cartShopping,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Sales Overview Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Sales Overview',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: DropdownButton<String>(
                    value: _selectedPeriod,
                    underline: const SizedBox(),
                    items: _periods.map((period) {
                      return DropdownMenuItem(
                        value: period,
                        child: Text(period),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedPeriod = value!;
                      });
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Sales Chart
            const SalesChart(),
            const SizedBox(height: 30),

            // Top Selling Items
            const Text(
              'Top Selling Items',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 15),
            const TopSellingItems(),
          ],
        ),
      ),
    );
  }
}
