import '../models/earnings.dart';

class EarningsService {
  static final EarningsService _instance = EarningsService._internal();
  factory EarningsService() => _instance;
  EarningsService._internal();

  final Earnings _earnings = const Earnings(
    today: 68.50,
    thisWeek: 328.75,
    thisMonth: 1240.00,
    todayDeliveries: 9,
    thisWeekDeliveries: 42,
    thisMonthDeliveries: 156,
    averageDeliveryTime: 24.0,
  );

  final List<CompletedOrder> _completedOrders = [
    CompletedOrder(
      id: '1',
      orderNumber: '#3238',
      customerName: 'Emma Wilson',
      amount: 9.25,
      distance: 3.2,
      completedAt: DateTime.now().subtract(const Duration(hours: 2)),
      rating: 5.0,
    ),
    CompletedOrder(
      id: '2',
      orderNumber: '#3235',
      customerName: 'James Thompson',
      amount: 7.50,
      distance: 2.1,
      completedAt: DateTime.now().subtract(const Duration(hours: 3)),
      rating: 4.5,
    ),
    CompletedOrder(
      id: '3',
      orderNumber: '#3232',
      customerName: 'Lisa Anderson',
      amount: 12.80,
      distance: 4.3,
      completedAt: DateTime.now().subtract(const Duration(hours: 5)),
      rating: 5.0,
    ),
  ];

  Earnings get earnings => _earnings;

  List<CompletedOrder> get completedOrders => List.from(_completedOrders);

  Future<Earnings> getEarnings() async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));
    return _earnings;
  }

  Future<List<CompletedOrder>> getCompletedOrders({
    String period = 'This Month',
  }) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 300));
    
    final now = DateTime.now();
    List<CompletedOrder> filteredOrders = List.from(_completedOrders);
    
    switch (period) {
      case 'Today':
        filteredOrders = _completedOrders.where((order) => 
          order.completedAt.day == now.day &&
          order.completedAt.month == now.month &&
          order.completedAt.year == now.year
        ).toList();
        break;
      case 'This Week':
        final weekStart = now.subtract(Duration(days: now.weekday - 1));
        filteredOrders = _completedOrders.where((order) => 
          order.completedAt.isAfter(weekStart)
        ).toList();
        break;
      case 'This Month':
        filteredOrders = _completedOrders.where((order) => 
          order.completedAt.month == now.month &&
          order.completedAt.year == now.year
        ).toList();
        break;
    }
    
    return filteredOrders;
  }

  Future<void> addCompletedOrder(CompletedOrder order) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 200));
    
    _completedOrders.insert(0, order);
  }
}



