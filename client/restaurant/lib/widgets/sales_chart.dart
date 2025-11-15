import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:restaurant_manager/constants/app_colors.dart';

class SalesChart extends StatelessWidget {
  const SalesChart({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 250,
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY: 1000,
          titlesData: FlTitlesData(
            leftTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  const style = TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 12,
                  );
                  switch (value.toInt()) {
                    case 0:
                      return const Text('Mon', style: style);
                    case 1:
                      return const Text('Tue', style: style);
                    case 2:
                      return const Text('Wed', style: style);
                    case 3:
                      return const Text('Thu', style: style);
                    case 4:
                      return const Text('Fri', style: style);
                    case 5:
                      return const Text('Sat', style: style);
                    case 6:
                      return const Text('Sun', style: style);
                    default:
                      return const Text('', style: style);
                  }
                },
              ),
            ),
          ),
          borderData: FlBorderData(show: false),
          barGroups: [
            BarChartGroupData(
              x: 0,
              barRods: [
                BarChartRodData(
                  toY: 450,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 1,
              barRods: [
                BarChartRodData(
                  toY: 520,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 2,
              barRods: [
                BarChartRodData(
                  toY: 480,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 3,
              barRods: [
                BarChartRodData(
                  toY: 610,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 4,
              barRods: [
                BarChartRodData(
                  toY: 750,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 5,
              barRods: [
                BarChartRodData(
                  toY: 820,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
            BarChartGroupData(
              x: 6,
              barRods: [
                BarChartRodData(
                  toY: 690,
                  color: AppColors.primary,
                  width: 20,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
                ),
              ],
            ),
          ],
          gridData: const FlGridData(show: false),
        ),
      ),
    );
  }
}
