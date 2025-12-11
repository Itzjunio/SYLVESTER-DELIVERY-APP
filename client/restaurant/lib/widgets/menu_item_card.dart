import 'package:flutter/material.dart';
// import 'package:cached_network_image/cached_network_image.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MenuItemCard extends StatefulWidget {
  final String name;
  final String description;
  final String price;
  final String imageUrl;
  final bool isAvailable;

  const MenuItemCard({
    super.key,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.isAvailable,
  });

  @override
  State<MenuItemCard> createState() => _MenuItemCardState();
}

class _MenuItemCardState extends State<MenuItemCard> {
  bool _isAvailable = true;

  @override
  void initState() {
    super.initState();
    _isAvailable = widget.isAvailable;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Row(
          children: [
            // Menu Item Image
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: Colors.grey[200],
              ),
              child: const Icon(
                Icons.restaurant_menu,
                size: 30,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 15),

            // Menu Item Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.description,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.price,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),

            // Actions
            Column(
              children: [
                // Availability Toggle
                Switch(
                  value: _isAvailable,
                  onChanged: (value) {
                    setState(() {
                      _isAvailable = value;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          _isAvailable
                              ? '${widget.name} is now available'
                              : '${widget.name} is now unavailable',
                        ),
                      ),
                    );
                  },
                  activeThumbColor: AppColors.primary,
                ),
                const SizedBox(height: 10),

                // Action Buttons
                Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        // TODO: Implement edit functionality
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Edit ${widget.name}')),
                        );
                      },
                      icon: const Icon(
                        FontAwesomeIcons.pencil,
                        size: 16,
                        color: AppColors.primary,
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        // TODO: Implement delete functionality
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Delete Item'),
                            content: Text('Are you sure you want to delete ${widget.name}?'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.of(context).pop(),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context).pop();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('${widget.name} deleted')),
                                  );
                                },
                                child: const Text('Delete'),
                              ),
                            ],
                          ),
                        );
                      },
                      icon: const Icon(
                        FontAwesomeIcons.trash,
                        size: 16,
                        color: AppColors.danger,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
