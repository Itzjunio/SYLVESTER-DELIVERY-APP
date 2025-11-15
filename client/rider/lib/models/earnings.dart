class Earnings {
  final double today;
  final double thisWeek;
  final double thisMonth;
  final int todayDeliveries;
  final int thisWeekDeliveries;
  final int thisMonthDeliveries;
  final double averageDeliveryTime; // in minutes

  const Earnings({
    required this.today,
    required this.thisWeek,
    required this.thisMonth,
    required this.todayDeliveries,
    required this.thisWeekDeliveries,
    required this.thisMonthDeliveries,
    required this.averageDeliveryTime,
  });

  Earnings copyWith({
    double? today,
    double? thisWeek,
    double? thisMonth,
    int? todayDeliveries,
    int? thisWeekDeliveries,
    int? thisMonthDeliveries,
    double? averageDeliveryTime,
  }) {
    return Earnings(
      today: today ?? this.today,
      thisWeek: thisWeek ?? this.thisWeek,
      thisMonth: thisMonth ?? this.thisMonth,
      todayDeliveries: todayDeliveries ?? this.todayDeliveries,
      thisWeekDeliveries: thisWeekDeliveries ?? this.thisWeekDeliveries,
      thisMonthDeliveries: thisMonthDeliveries ?? this.thisMonthDeliveries,
      averageDeliveryTime: averageDeliveryTime ?? this.averageDeliveryTime,
    );
  }
}

class CompletedOrder {
  final String id;
  final String orderNumber;
  final String customerName;
  final double amount;
  final double distance;
  final DateTime completedAt;
  final double rating;

  const CompletedOrder({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.amount,
    required this.distance,
    required this.completedAt,
    required this.rating,
  });
}



