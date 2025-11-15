import 'package:flutter/material.dart';

class StatsCard extends StatelessWidget {
  final String title;
  final String value;
  final Color? valueColor;
  final IconData? icon;

  const StatsCard({
    super.key,
    required this.title,
    required this.value,
    this.valueColor,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 32,
                color: valueColor ?? Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 8),
            ],
            Text(
              title,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: valueColor ?? Theme.of(context).primaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}



