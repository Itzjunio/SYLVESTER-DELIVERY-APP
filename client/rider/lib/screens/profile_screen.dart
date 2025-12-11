import 'package:flutter/material.dart';
import '../services/user_service.dart';
import '../models/user.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _userService = UserService();
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;

  Future<void> _logout() async {
    try {
      await _userService.logout();
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Logout failed: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _userService.currentUser;

    if (user == null) {
      return const Center(
        child: Text('Please login to view profile'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(15),
      child: Column(
        children: [
          const SizedBox(height: 20),
          CircleAvatar(
            radius: 50,
            backgroundImage: AssetImage(user.profileImageUrl),
          ),
          const SizedBox(height: 15),
          Text(
            user.name,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          Text(
            '${user.email} • ${user.phone}',
            style: const TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 30),

          // Account Settings
          Card(
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Account Settings',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  _buildSettingItem(
                    'Personal Information',
                    'Name, email, phone number',
                    () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const _EditPersonalInfoScreen()),
                      );
                    },
                  ),
                  _buildSettingItem(
                    'Vehicle Information',
                    user.vehicleInfo,
                    () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const _EditVehicleInfoScreen()),
                      );
                    },
                  ),
                  _buildSettingItem(
                    'Payment Methods',
                    'Bank account, mobile money',
                    () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const _PaymentMethodsScreen()),
                      );
                    },
                  ),
                  _buildSettingItem(
                    'Change Password',
                    'Update your password',
                    () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const _ChangePasswordScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // App Settings
          Card(
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'App Settings',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 15),
                  _buildSwitchItem(
                    'Notifications',
                    'Order updates, promotions',
                    _notificationsEnabled,
                    (value) => setState(() => _notificationsEnabled = value),
                  ),
                  _buildSwitchItem(
                    'Dark Mode',
                    'Switch to dark theme',
                    _darkModeEnabled,
                    (value) => setState(() => _darkModeEnabled = value),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 30),

          // Logout button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _logout,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              child: const Text('Logout'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem(String title, String subtitle, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchItem(
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}

// --- Account Settings Screens ---

class _EditPersonalInfoScreen extends StatefulWidget {
  const _EditPersonalInfoScreen();
  @override
  State<_EditPersonalInfoScreen> createState() => _EditPersonalInfoScreenState();
}

class _EditPersonalInfoScreenState extends State<_EditPersonalInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final user = UserService().currentUser;
    if (user != null) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      _phoneController.text = user.phone;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Personal Information')),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Full Name', prefixIcon: Icon(Icons.person)),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email)),
                keyboardType: TextInputType.emailAddress,
                validator: (v) => v!.contains('@') ? null : 'Invalid email',
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(labelText: 'Phone', prefixIcon: Icon(Icons.phone)),
                keyboardType: TextInputType.phone,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) return;
                    await UserService().updatePersonalInfo(
                      name: _nameController.text.trim(),
                      email: _emailController.text.trim(),
                      phone: _phoneController.text.trim(),
                    );
                    if (mounted) Navigator.of(context).pop();
                  },
                  child: const Text('Save Changes'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EditVehicleInfoScreen extends StatefulWidget {
  const _EditVehicleInfoScreen();
  @override
  State<_EditVehicleInfoScreen> createState() => _EditVehicleInfoScreenState();
}

class _EditVehicleInfoScreenState extends State<_EditVehicleInfoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _vehicleNumberController = TextEditingController();
  VehicleType _vehicleType = VehicleType.bike;

  @override
  void initState() {
    super.initState();
    final user = UserService().currentUser;
    if (user != null) {
      _vehicleType = user.vehicleType;
    }
  }

  @override
  void dispose() {
    _vehicleNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Vehicle Information')),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              DropdownButtonFormField<VehicleType>(
                initialValue: _vehicleType,
                items: VehicleType.values
                    .map((v) => DropdownMenuItem(value: v, child: Text(v.displayName)))
                    .toList(),
                onChanged: (v) => setState(() => _vehicleType = v ?? _vehicleType),
                decoration: const InputDecoration(prefixIcon: Icon(Icons.two_wheeler), labelText: 'Vehicle Type'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _vehicleNumberController,
                decoration: const InputDecoration(labelText: 'Vehicle Registration', prefixIcon: Icon(Icons.numbers)),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) return;
                    await UserService().updateVehicleInfo(
                      vehicleType: _vehicleType,
                      vehicleRegistration: _vehicleNumberController.text.trim(),
                    );
                    if (mounted) Navigator.of(context).pop();
                  },
                  child: const Text('Save Changes'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PaymentMethodsScreen extends StatefulWidget {
  const _PaymentMethodsScreen();
  @override
  State<_PaymentMethodsScreen> createState() => _PaymentMethodsScreenState();
}

class _PaymentMethodsScreenState extends State<_PaymentMethodsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _bankNameController = TextEditingController();
  final _accountNumberController = TextEditingController();
  final _momoProviderController = TextEditingController();
  final _momoNumberController = TextEditingController();

  @override
  void dispose() {
    _bankNameController.dispose();
    _accountNumberController.dispose();
    _momoProviderController.dispose();
    _momoNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment Methods')),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              const Text('Bank Account', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _bankNameController,
                decoration: const InputDecoration(labelText: 'Bank Name', prefixIcon: Icon(Icons.account_balance)),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _accountNumberController,
                decoration: const InputDecoration(labelText: 'Account Number', prefixIcon: Icon(Icons.numbers)),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 20),
              const Text('Mobile Money', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _momoProviderController,
                decoration: const InputDecoration(labelText: 'Provider (e.g., MTN, Vodafone)', prefixIcon: Icon(Icons.phone_iphone)),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _momoNumberController,
                decoration: const InputDecoration(labelText: 'MoMo Number', prefixIcon: Icon(Icons.phone_android)),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (mounted) Navigator.of(context).pop();
                  },
                  child: const Text('Save Payment Details'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ChangePasswordScreen extends StatefulWidget {
  const _ChangePasswordScreen();
  @override
  State<_ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<_ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  @override
  void dispose() {
    _currentController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Change Password')),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _currentController,
                decoration: const InputDecoration(labelText: 'Current Password', prefixIcon: Icon(Icons.lock_outline)),
                obscureText: true,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _newController,
                decoration: const InputDecoration(labelText: 'New Password', prefixIcon: Icon(Icons.lock)),
                obscureText: true,
                validator: (v) => v != null && v.length >= 6 ? null : 'At least 6 characters',
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _confirmController,
                decoration: const InputDecoration(labelText: 'Confirm Password', prefixIcon: Icon(Icons.lock)),
                obscureText: true,
                validator: (v) => v == _newController.text ? null : 'Passwords do not match',
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (!_formKey.currentState!.validate()) return;
                    if (mounted) Navigator.of(context).pop();
                  },
                  child: const Text('Update Password'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
