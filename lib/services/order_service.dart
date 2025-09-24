import '../models/order.dart';

class OrderService {
  static final OrderService _instance = OrderService._internal();
  factory OrderService() => _instance;
  OrderService._internal();

  final List<Order> _orders = [
    Order(
      id: '1',
      orderNumber: '#3245',
      status: OrderStatus.pending,
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      items: '2x Burger, Fries, Coke',
      amount: 8.50,
      distance: 2.3,
      pickupAddress: 'Burger Palace, 123 Main Street',
      deliveryAddress: '456 Oak Avenue, Apt 5B',
      createdAt: DateTime.now().subtract(const Duration(minutes: 5)),
    ),
    Order(
      id: '2',
      orderNumber: '#3241',
      status: OrderStatus.pickedUp,
      customerName: 'Robert Chen',
      customerPhone: '+1 (555) 234-5678',
      items: 'Pizza, Garlic Bread',
      amount: 12.75,
      distance: 1.7,
      pickupAddress: 'Pizza Palace, 789 Pine Street',
      deliveryAddress: 'Office Building, 456 Oak Avenue, Apt 5B',
      createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
      acceptedAt: DateTime.now().subtract(const Duration(minutes: 25)),
      pickedUpAt: DateTime.now().subtract(const Duration(minutes: 10)),
    ),
  ];

  List<Order> get activeOrders => _orders.where((order) => 
    order.status != OrderStatus.delivered && order.status != OrderStatus.cancelled
  ).toList();

  List<Order> get completedOrders => _orders.where((order) => 
    order.status == OrderStatus.delivered
  ).toList();

  Future<List<Order>> getOrders() async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));
    return List.from(_orders);
  }

  Future<Order?> getOrderById(String id) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 300));
    try {
      return _orders.firstWhere((order) => order.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<bool> acceptOrder(String orderId) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    final index = _orders.indexWhere((order) => order.id == orderId);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(
        status: OrderStatus.accepted,
        acceptedAt: DateTime.now(),
      );
      return true;
    }
    return false;
  }

  Future<bool> markAsPickedUp(String orderId) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    final index = _orders.indexWhere((order) => order.id == orderId);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(
        status: OrderStatus.pickedUp,
        pickedUpAt: DateTime.now(),
      );
      return true;
    }
    return false;
  }

  Future<bool> markAsDelivered(String orderId) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    final index = _orders.indexWhere((order) => order.id == orderId);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(
        status: OrderStatus.delivered,
        deliveredAt: DateTime.now(),
      );
      return true;
    }
    return false;
  }

  Future<bool> cancelOrder(String orderId) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    final index = _orders.indexWhere((order) => order.id == orderId);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(
        status: OrderStatus.cancelled,
      );
      return true;
    }
    return false;
  }
}



