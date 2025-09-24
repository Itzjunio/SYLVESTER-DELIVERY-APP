import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../services/user_service.dart';
import '../models/user.dart';
import '../widgets/vehicle_selector.dart';
import '../widgets/success_dialog.dart';

class SignupPage extends StatefulWidget {
  final VoidCallback onSignup;
  final VoidCallback onShowLogin;

  const SignupPage({
    super.key,
    required this.onSignup,
    required this.onShowLogin,
  });

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _userService = UserService();
  
  VehicleType _selectedVehicle = VehicleType.bike;
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(15),
          child: Column(
            children: [
              const SizedBox(height: 50),
              const Text(
                'Create Rider Account',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text(
                'Join our delivery team',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 40),
              
              // Signup form card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(25),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Full name field
                        TextFormField(
                          controller: _nameController,
                          decoration: const InputDecoration(
                            labelText: 'Full Name',
                            prefixIcon: Icon(Icons.person),
                          ),
                          validator: (value) => value!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 15),
                        
                        // Email field
                        TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email Address',
                            prefixIcon: Icon(Icons.email),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value!.isEmpty) return 'Required';
                            if (!value.contains('@')) return 'Invalid email';
                            return null;
                          },
                        ),
                        const SizedBox(height: 15),
                        
                        // Phone field
                        TextFormField(
                          controller: _phoneController,
                          decoration: const InputDecoration(
                            labelText: 'Phone Number',
                            prefixIcon: Icon(Icons.phone),
                          ),
                          keyboardType: TextInputType.phone,
                          validator: (value) => value!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 15),
                        
                        // Password field
                        TextFormField(
                          controller: _passwordController,
                          decoration: const InputDecoration(
                            labelText: 'Password',
                            prefixIcon: Icon(Icons.lock),
                          ),
                          obscureText: true,
                          validator: (value) {
                            if (value!.isEmpty) return 'Required';
                            if (value.length < 6) return 'Password must be at least 6 characters';
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        
                        // Vehicle selector
                        VehicleSelector(
                          selectedVehicle: _selectedVehicle,
                          onVehicleChanged: (vehicle) {
                            setState(() => _selectedVehicle = vehicle);
                          },
                        ),
                        const SizedBox(height: 20),
                        
                        // Signup button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleSignup,
                            child: _isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Text('Create Account'),
                          ),
                        ),
                        const SizedBox(height: 20),
                        
                        // Login link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Already have an account? '),
                            TextButton(
                              onPressed: widget.onShowLogin,
                              child: const Text('Login'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final success = await _userService.signup(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        phone: _phoneController.text.trim(),
        password: _passwordController.text,
        vehicleType: _selectedVehicle,
      );

      if (success) {
        if (mounted) {
          SuccessDialog.show(
            context: context,
            title: 'Account Created Successfully!',
            message: 'You can now login with your credentials',
            buttonText: 'Continue to Login',
            onButtonPressed: () {
              Navigator.of(context).pop();
              widget.onSignup();
            },
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Signup failed. Please try again.'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Signup failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
}



