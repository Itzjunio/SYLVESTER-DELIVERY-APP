class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String profileImageUrl;
  final VehicleType vehicleType;
  final String vehicleInfo;
  final bool isOnline;
  final double earnings;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.profileImageUrl,
    required this.vehicleType,
    required this.vehicleInfo,
    required this.isOnline,
    required this.earnings,
  });

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? profileImageUrl,
    VehicleType? vehicleType,
    String? vehicleInfo,
    bool? isOnline,
    double? earnings,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      vehicleType: vehicleType ?? this.vehicleType,
      vehicleInfo: vehicleInfo ?? this.vehicleInfo,
      isOnline: isOnline ?? this.isOnline,
      earnings: earnings ?? this.earnings,
    );
  }
}

enum VehicleType {
  bike,
  motorbike,
  car,
}

extension VehicleTypeExtension on VehicleType {
  String get displayName {
    switch (this) {
      case VehicleType.bike:
        return 'Bike';
      case VehicleType.motorbike:
        return 'Motorbike';
      case VehicleType.car:
        return 'Car';
    }
  }

  String get iconName {
    switch (this) {
      case VehicleType.bike:
        return 'directions_bike';
      case VehicleType.motorbike:
        return 'motorcycle';
      case VehicleType.car:
        return 'directions_car';
    }
  }
}



