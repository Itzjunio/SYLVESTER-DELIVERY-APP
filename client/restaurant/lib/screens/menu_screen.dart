import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/menu_item_card.dart';
import 'package:restaurant_manager/widgets/add_item_dialog.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Menu Management'),
        actions: [
          IconButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => const AddItemDialog(),
              );
            },
            icon: const Icon(FontAwesomeIcons.plus),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category Tabs
          Container(
            color: Colors.white,
            child: TabBar(
              controller: _tabController,
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textMuted,
              indicatorColor: AppColors.primary,
              tabs: const [
                Tab(text: 'All Items'),
                Tab(text: 'Starters'),
                Tab(text: 'Main Dishes'),
                Tab(text: 'Drinks'),
              ],
            ),
          ),
          
          // Menu Items List
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildMenuItemsList(),
                _buildMenuItemsList(category: 'Starters'),
                _buildMenuItemsList(category: 'Main Dishes'),
                _buildMenuItemsList(category: 'Drinks'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItemsList({String? category}) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(15),
      child: Column(
        children: [
          const MenuItemCard(
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce and mozzarella',
            price: '\$12.99',
            imageUrl: 'https://images.unsplash.com/photo-1567602901358-5ba00815eb15?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            isAvailable: true,
          ),
          const SizedBox(height: 15),
          const MenuItemCard(
            name: 'Spaghetti Carbonara',
            description: 'Creamy pasta with eggs, cheese, and pancetta',
            price: '\$14.50',
            imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            isAvailable: true,
          ),
          const SizedBox(height: 15),
          const MenuItemCard(
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, and special sauce',
            price: '\$10.99',
            imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            isAvailable: true,
          ),
        ],
      ),
    );
  }
}
