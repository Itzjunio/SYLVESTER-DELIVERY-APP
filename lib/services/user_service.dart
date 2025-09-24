import '../models/user.dart';

class UserService {
  static final UserService _instance = UserService._internal();
  factory UserService() => _instance;
  UserService._internal();

  User? _currentUser;

  User? get currentUser => _currentUser;

  bool get isLoggedIn => _currentUser != null;

  Future<bool> login(String email, String password, VehicleType vehicleType) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock login - in real app, this would call an API
    if (email.isNotEmpty && password.isNotEmpty) {
      _currentUser = User(
        id: '1',
        name: 'Michael Rodriguez',
        email: email,
        phone: '+1 (234) 567-8901',
        profileImageUrl: 'assets/images/profile.jpg',
        vehicleType: vehicleType,
        vehicleInfo: '${vehicleType.displayName} • ABC 123',
        isOnline: true,
        earnings: 128.50,
      );
      return true;
    }
    return false;
  }

  Future<bool> signup({
    required String name,
    required String email,
    required String phone,
    required String password,
    required VehicleType vehicleType,
  }) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock signup - in real app, this would call an API
    if (name.isNotEmpty && email.isNotEmpty && phone.isNotEmpty && password.isNotEmpty) {
      _currentUser = User(
        id: '1',
        name: name,
        email: email,
        phone: phone,
        profileImageUrl: 'assets/images/profile.jpg',
        vehicleType: vehicleType,
        vehicleInfo: '${vehicleType.displayName} • ABC 123',
        isOnline: true,
        earnings: 0.0,
      );
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    _currentUser = null;
  }

  Future<void> updateOnlineStatus(bool isOnline) async {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(isOnline: isOnline);
    }
  }

  Future<void> updateEarnings(double earnings) async {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(earnings: earnings);
    }
  }

  Future<void> updatePersonalInfo({
    required String name,
    required String email,
    required String phone,
  }) async {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(
        name: name,
        email: email,
        phone: phone,
      );
    }
  }

  Future<void> updateVehicleInfo({
    required VehicleType vehicleType,
    required String vehicleRegistration,
  }) async {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(
        vehicleType: vehicleType,
        vehicleInfo: '${vehicleType.displayName} • $vehicleRegistration',
      );
    }
  }
}



