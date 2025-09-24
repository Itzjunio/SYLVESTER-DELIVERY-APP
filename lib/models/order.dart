class Order {
  final String id;
  final String orderNumber;
  final OrderStatus status;
  final String customerName;
  final String customerPhone;
  final String items;
  final double amount;
  final double distance;
  final String pickupAddress;
  final String deliveryAddress;
  final DateTime createdAt;
  final DateTime? acceptedAt;
  final DateTime? pickedUpAt;
  final DateTime? deliveredAt;

  const Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.customerName,
    required this.customerPhone,
    required this.items,
    required this.amount,
    required this.distance,
    required this.pickupAddress,
    required this.deliveryAddress,
    required this.createdAt,
    this.acceptedAt,
    this.pickedUpAt,
    this.deliveredAt,
  });

  Order copyWith({
    String? id,
    String? orderNumber,
    OrderStatus? status,
    String? customerName,
    String? customerPhone,
    String? items,
    double? amount,
    double? distance,
    String? pickupAddress,
    String? deliveryAddress,
    DateTime? createdAt,
    DateTime? acceptedAt,
    DateTime? pickedUpAt,
    DateTime? deliveredAt,
  }) {
    return Order(
      id: id ?? this.id,
      orderNumber: orderNumber ?? this.orderNumber,
      status: status ?? this.status,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      items: items ?? this.items,
      amount: amount ?? this.amount,
      distance: distance ?? this.distance,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      createdAt: createdAt ?? this.createdAt,
      acceptedAt: acceptedAt ?? this.acceptedAt,
      pickedUpAt: pickedUpAt ?? this.pickedUpAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
    );
  }
}

enum OrderStatus {
  pending,
  accepted,
  pickedUp,
  delivered,
  cancelled,
}

extension OrderStatusExtension on OrderStatus {
  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.accepted:
        return 'Accepted';
      case OrderStatus.pickedUp:
        return 'Picked Up';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  String get colorName {
    switch (this) {
      case OrderStatus.pending:
        return 'orange';
      case OrderStatus.accepted:
        return 'blue';
      case OrderStatus.pickedUp:
        return 'blue';
      case OrderStatus.delivered:
        return 'green';
      case OrderStatus.cancelled:
        return 'red';
    }
  }
}



