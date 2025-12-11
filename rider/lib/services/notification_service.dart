import '../models/notification.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final List<AppNotification> _notifications = [
    AppNotification(
      id: '1',
      title: 'New Order Request',
      message: 'Order #3247 for ₵10.25, 2.1km away',
      type: NotificationType.order,
      timestamp: DateTime.now().subtract(const Duration(minutes: 2)),
      isDismissible: false,
    ),
    AppNotification(
      id: '2',
      title: 'Payment Received',
      message: '₵12.80 for Order #3232 has been deposited',
      type: NotificationType.payment,
      timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
    ),
    AppNotification(
      id: '3',
      title: 'New Rating',
      message: 'Lisa Anderson gave you 5 stars for Order #3232',
      type: NotificationType.rating,
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
    ),
    AppNotification(
      id: '4',
      title: 'Peak Hours',
      message: 'High demand expected between 6-9 PM today',
      type: NotificationType.system,
      timestamp: DateTime.now().subtract(const Duration(hours: 5)),
    ),
  ];

  List<AppNotification> get notifications => List.from(_notifications);

  List<AppNotification> get unreadNotifications => 
    _notifications.where((notification) => !notification.isRead).toList();

  int get unreadCount => unreadNotifications.length;

  Future<List<AppNotification>> getNotifications() async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_notifications);
  }

  Future<void> markAsRead(String notificationId) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 200));
    
    final index = _notifications.indexWhere((notification) => notification.id == notificationId);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
    }
  }

  Future<void> dismissNotification(String notificationId) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 200));
    
    _notifications.removeWhere((notification) => notification.id == notificationId);
  }

  Future<void> addNotification(AppNotification notification) async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 200));
    
    _notifications.insert(0, notification);
  }

  Future<void> clearAllNotifications() async {
    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 200));
    
    _notifications.clear();
  }
}



