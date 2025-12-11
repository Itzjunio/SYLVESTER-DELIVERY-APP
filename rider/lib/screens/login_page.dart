import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../services/user_service.dart';
import '../models/user.dart';
import '../widgets/vehicle_selector.dart';
// import '../widgets/success_dialog.dart';

class LoginPage extends StatefulWidget {
  final VoidCallback onLogin;
  final VoidCallback onShowSignup;

  const LoginPage({
    super.key,
    required this.onLogin,
    required this.onShowSignup,
  });

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _userService = UserService();

  VehicleType _selectedVehicle = VehicleType.bike;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
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
              // App logo
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(50),
                  image: const DecorationImage(
                    image: AssetImage('assets/images/logo.jpg'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Rider Delivery App',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text(
                'Deliver food and earn money',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 40),

              // Login form card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(25),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        const Text(
                          'Rider Login',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 20),

                        // Email/Phone field
                        TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email or Phone',
                            prefixIcon: Icon(Icons.email),
                          ),
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
                          validator: (value) => value!.isEmpty ? 'Required' : null,
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

                        // Login button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleLogin,
                            child: _isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Text('Login'),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Forgot password
                        TextButton(
                          onPressed: () {
                            // TODO: Implement forgot password
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Forgot password feature coming soon')),
                            );
                          },
                          child: const Text('Forgot Password?'),
                        ),
                        const SizedBox(height: 20),

                        // Social login buttons
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // TODO: Implement Google login
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Google login coming soon')),
                              );
                            },
                            icon: SvgPicture.asset(
                              'assets/images/google.svg',
                              height: 20,
                              width: 20,
                            ),
                            label: const Text('Sign in with Google'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.black,
                              side: const BorderSide(color: Colors.grey),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // TODO: Implement Facebook login
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Facebook login coming soon')),
                              );
                            },
                            icon: SvgPicture.asset(
                              'assets/images/facebook.svg',
                              height: 20,
                              width: 20,
                            ),
                            label: const Text('Sign in with Facebook'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.black,
                              side: const BorderSide(color: Colors.grey),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Sign up link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text("Don't have an account? "),
                            TextButton(
                              onPressed: widget.onShowSignup,
                              child: const Text('Sign up'),
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

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final success = await _userService.login(
        _emailController.text.trim(),
        _passwordController.text,
        _selectedVehicle,
      );

      if (success) {
        widget.onLogin();
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Invalid credentials. Please try again.'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Login failed: $e'),
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



