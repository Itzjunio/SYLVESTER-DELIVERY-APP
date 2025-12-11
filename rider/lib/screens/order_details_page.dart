import 'package:flutter/material.dart';
import '../services/order_service.dart';
import '../models/order.dart';

class OrderDetailsPage extends StatefulWidget {
  final String orderId;
  
  const OrderDetailsPage({super.key, required this.orderId});

  @override
  State<OrderDetailsPage> createState() => _OrderDetailsPageState();
}

class _OrderDetailsPageState extends State<OrderDetailsPage> {
  final _orderService = OrderService();
  Order? _order;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadOrder();
  }

  Future<void> _loadOrder() async {
    try {
      final order = await _orderService.getOrderById(widget.orderId);
      setState(() {
        _order = order;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load order: $e')),
        );
      }
    }
  }

  Future<void> _markAsDelivered() async {
    if (_order == null) return;
    
    try {
      final success = await _orderService.markAsDelivered(_order!.id);
      if (success) {
        await _loadOrder();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Order marked as delivered successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to mark as delivered: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Order Details')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_order == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Order Details')),
        body: const Center(
          child: Text('Order not found'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_order!.orderNumber),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _getStatusColor(_order!.status),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Text(
                _order!.status.displayName,
                style: const TextStyle(color: Colors.white, fontSize: 14),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          children: [
            // Map placeholder
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map, size: 48, color: Colors.grey),
                    SizedBox(height: 10),
                    Text('Google Maps Integration'),
                    Text('Coming soon', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            
            // Progress bar
            Container(
              height: 8,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(4),
              ),
              child: FractionallySizedBox(
                widthFactor: _getProgressValue(_order!.status),
                child: Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            
            // Status indicators
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatusCircle(context, 'Accepted', _order!.status.index >= 1),
                _buildStatusCircle(context, 'Picked Up', _order!.status.index >= 2),
                _buildStatusCircle(context, 'Delivered', _order!.status == OrderStatus.delivered),
              ],
            ),
            const SizedBox(height: 20),
            
            // Pickup location
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on, color: Colors.red),
                title: const Text('Pickup Location'),
                subtitle: Text(_order!.pickupAddress),
              ),
            ),
            const SizedBox(height: 10),
            
            // Delivery location
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on, color: Colors.green),
                title: const Text('Drop-off Location'),
                subtitle: Text(_order!.deliveryAddress),
              ),
            ),
            const SizedBox(height: 20),
            
            // Action buttons
            Column(
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Implement phone call
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Calling customer...')),
                    );
                  },
                  icon: const Icon(Icons.phone),
                  label: Text('Call Customer (${_order!.customerPhone})'),
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Implement messaging
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Messaging feature coming soon')),
                    );
                  },
                  icon: const Icon(Icons.chat),
                  label: const Text('Message Customer'),
                ),
                const SizedBox(height: 10),
                if (_order!.status == OrderStatus.pickedUp)
                  ElevatedButton.icon(
                    onPressed: _markAsDelivered,
                    icon: const Icon(Icons.check_circle),
                    label: const Text('Mark as Delivered'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return Colors.orange;
      case OrderStatus.accepted:
        return Colors.blue;
      case OrderStatus.pickedUp:
        return Colors.blue;
      case OrderStatus.delivered:
        return Colors.green;
      case OrderStatus.cancelled:
        return Colors.red;
    }
  }

  double _getProgressValue(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 0.0;
      case OrderStatus.accepted:
        return 0.33;
      case OrderStatus.pickedUp:
        return 0.66;
      case OrderStatus.delivered:
        return 1.0;
      case OrderStatus.cancelled:
        return 0.0;
    }
  }

  Widget _buildStatusCircle(BuildContext context, String label, bool completed) {
    return Column(
      children: [
        Container(
          decoration: BoxDecoration(
            color: completed ? Theme.of(context).primaryColor : Colors.grey,
            shape: BoxShape.circle,
          ),
          padding: const EdgeInsets.all(8),
          child: Icon(
            completed ? Icons.check : Icons.location_on,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(label),
      ],
    );
  }
}
