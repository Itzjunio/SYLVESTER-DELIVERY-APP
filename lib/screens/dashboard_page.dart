import 'package:flutter/material.dart';
import '../services/user_service.dart';
import '../services/order_service.dart';
import '../widgets/rider_profile_card.dart';
import '../widgets/order_card.dart';
import 'order_details_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final _userService = UserService();
  final _orderService = OrderService();
  List<dynamic> _activeOrders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadActiveOrders();
  }

  Future<void> _loadActiveOrders() async {
    setState(() => _isLoading = true);
    try {
      final orders = await _orderService.getOrders();
      setState(() {
        _activeOrders = orders.where((order) => 
          order.status.name != 'delivered' && order.status.name != 'cancelled'
        ).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load orders: $e')),
        );
      }
    }
  }

  Future<void> _handleAcceptOrder(String orderId) async {
    try {
      final success = await _orderService.acceptOrder(orderId);
      if (success) {
        await _loadActiveOrders();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Order accepted successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to accept order: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _handleCompleteOrder(String orderId) async {
    try {
      final success = await _orderService.markAsPickedUp(orderId);
      if (success) {
        await _loadActiveOrders();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Order marked as picked up!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update order: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _viewOrderDetails(String orderId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderDetailsPage(orderId: orderId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _userService.currentUser;
    
    if (user == null) {
      return const Center(
        child: Text('Please login to view dashboard'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Rider profile card
          RiderProfileCard(user: user),
          const SizedBox(height: 20),
          
          // Active orders section
          const Text(
            'Active Orders',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          
          // Orders list
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: CircularProgressIndicator(),
              ),
            )
          else if (_activeOrders.isEmpty)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Icon(
                      Icons.delivery_dining,
                      size: 48,
                      color: Colors.grey.shade400,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'No active orders',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey.shade600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'New delivery requests will appear here',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade500,
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            ..._activeOrders.map((order) => Padding(
              padding: const EdgeInsets.only(bottom: 15),
              child: OrderCard(
                order: order,
                onAccept: () => _handleAcceptOrder(order.id),
                onComplete: () => _handleCompleteOrder(order.id),
                onViewDetails: () => _viewOrderDetails(order.id),
              ),
            )),
        ],
      ),
    );
  }
}



