import 'package:flutter/material.dart';
import '../services/notification_service.dart';
import '../models/notification.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  final _notificationService = NotificationService();
  List<AppNotification> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    try {
      final notifications = await _notificationService.getNotifications();
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load notifications: $e')),
        );
      }
    }
  }

  Future<void> _dismissNotification(String notificationId) async {
    try {
      await _notificationService.dismissNotification(notificationId);
      await _loadNotifications();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to dismiss notification: $e')),
        );
      }
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    try {
      await _notificationService.markAsRead(notificationId);
      await _loadNotifications();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to mark as read: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (_notifications.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear_all),
              onPressed: () async {
                await _notificationService.clearAllNotifications();
                await _loadNotifications();
              },
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.notifications_none, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'No notifications',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'You\'ll see new notifications here',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(15),
                  itemCount: _notifications.length,
                  itemBuilder: (context, index) {
                    final notification = _notifications[index];
                    return Dismissible(
                      key: Key(notification.id),
                      direction: notification.isDismissible
                          ? DismissDirection.endToStart
                          : DismissDirection.none,
                      onDismissed: (direction) {
                        _dismissNotification(notification.id);
                      },
                      background: Container(
                        color: Colors.red,
                        alignment: Alignment.centerRight,
                        padding: const EdgeInsets.only(right: 20),
                        child: const Icon(Icons.delete, color: Colors.white),
                      ),
                      child: Card(
                        child: ListTile(
                          leading: Icon(
                            _getNotificationIcon(notification.type),
                            color: _getNotificationColor(notification.type),
                          ),
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  notification.title,
                                  style: TextStyle(
                                    fontWeight: notification.isRead
                                        ? FontWeight.normal
                                        : FontWeight.bold,
                                  ),
                                ),
                              ),
                              Text(
                                _formatTime(notification.timestamp),
                                style: const TextStyle(
                                  color: Colors.grey,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          subtitle: Text(notification.message),
                          trailing: notification.isDismissible
                              ? IconButton(
                                  icon: const Icon(Icons.close),
                                  onPressed: () => _dismissNotification(notification.id),
                                )
                              : null,
                          onTap: () {
                            if (!notification.isRead) {
                              _markAsRead(notification.id);
                            }
                          },
                        ),
                      ),
                    );
                  },
                ),
    );
  }

  IconData _getNotificationIcon(NotificationType type) {
    switch (type) {
      case NotificationType.order:
        return Icons.notifications;
      case NotificationType.payment:
        return Icons.currency_exchange;
      case NotificationType.rating:
        return Icons.star;
      case NotificationType.system:
        return Icons.flash_on;
      case NotificationType.promotion:
        return Icons.local_offer;
    }
  }

  Color _getNotificationColor(NotificationType type) {
    switch (type) {
      case NotificationType.order:
        return Colors.blue;
      case NotificationType.payment:
        return Colors.green;
      case NotificationType.rating:
        return Colors.amber;
      case NotificationType.system:
        return Colors.red;
      case NotificationType.promotion:
        return Colors.purple;
    }
  }

  String _formatTime(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Now';
    }
  }
}
