class AppNotification {
  final String id;
  final String title;
  final String message;
  final NotificationType type;
  final DateTime timestamp;
  final bool isRead;
  final bool isDismissible;

  const AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.timestamp,
    this.isRead = false,
    this.isDismissible = true,
  });

  AppNotification copyWith({
    String? id,
    String? title,
    String? message,
    NotificationType? type,
    DateTime? timestamp,
    bool? isRead,
    bool? isDismissible,
  }) {
    return AppNotification(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      timestamp: timestamp ?? this.timestamp,
      isRead: isRead ?? this.isRead,
      isDismissible: isDismissible ?? this.isDismissible,
    );
  }
}

enum NotificationType {
  order,
  payment,
  rating,
  system,
  promotion,
}

extension NotificationTypeExtension on NotificationType {
  String get iconName {
    switch (this) {
      case NotificationType.order:
        return 'notifications';
      case NotificationType.payment:
        return 'currency_exchange';
      case NotificationType.rating:
        return 'star';
      case NotificationType.system:
        return 'flash_on';
      case NotificationType.promotion:
        return 'local_offer';
    }
  }

  String get colorName {
    switch (this) {
      case NotificationType.order:
        return 'blue';
      case NotificationType.payment:
        return 'green';
      case NotificationType.rating:
        return 'amber';
      case NotificationType.system:
        return 'red';
      case NotificationType.promotion:
        return 'purple';
    }
  }
}



