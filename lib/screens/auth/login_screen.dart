import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_manager/providers/app_state_provider.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/custom_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
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
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 40),
              // Restaurant Logo
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary,
                ),
                child: const Icon(
                  Icons.restaurant,
                  size: 50,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Restaurant Manager Pro',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Manage your restaurant with ease',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 40),
              
              // Login Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(25),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Text(
                          'Login to your account',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 30),
                        
                        // Email Field
                        CustomTextField(
                          controller: _emailController,
                          labelText: 'Email address',
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            }
                            if (!value.contains('@')) {
                              return 'Please enter a valid email';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        
                        // Password Field
                        CustomTextField(
                          controller: _passwordController,
                          labelText: 'Password',
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your password';
                            }
                            if (value.length < 6) {
                              return 'Password must be at least 6 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 30),
                        
                        // Login Button
                        ElevatedButton(
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
                        const SizedBox(height: 20),
                        
                        // Forgot Password
                        TextButton(
                          onPressed: () {
                            // TODO: Implement forgot password
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Forgot password feature coming soon'),
                              ),
                            );
                          },
                          child: const Text('Forgot Password?'),
                        ),
                        const SizedBox(height: 20),
                        
                        // Social Login Buttons
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              // TODO: Implement Google sign in
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Google sign in coming soon'),
                                ),
                              );
                            },
                            icon: const Icon(
                              Icons.g_mobiledata,
                              size: 20,
                              color: Colors.red,
                            ),
                            label: const Text('Sign in with Google'),
                          ),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              // TODO: Implement Facebook sign in
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Facebook sign in coming soon'),
                                ),
                              );
                            },
                            icon: const Icon(
                              Icons.facebook,
                              size: 20,
                              color: Colors.blue,
                            ),
                            label: const Text('Sign in with Facebook'),
                          ),
                        ),
                        const SizedBox(height: 20),
                        
                        // Sign Up Link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Don't have an account? ",
                              style: TextStyle(color: AppColors.textMuted),
                            ),
                            TextButton(
                              onPressed: () {
                                context.read<AppStateProvider>().navigateToPage(
                                  AppStateProvider.signupPage,
                                );
                              },
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

    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoading = false;
    });

    // Login successful
    context.read<AppStateProvider>().login();
  }
}
