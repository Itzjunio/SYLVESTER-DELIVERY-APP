import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/custom_text_field.dart';

class ContactSupportForm extends StatefulWidget {
  const ContactSupportForm({super.key});

  @override
  State<ContactSupportForm> createState() => _ContactSupportFormState();
}

class _ContactSupportFormState extends State<ContactSupportForm> {
  final _formKey = GlobalKey<FormState>();
  final _subjectController = TextEditingController();
  final _messageController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _subjectController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Contact Support',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Having issues? Our support team is here to help you.',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 20),
              
              // Subject Field
              CustomTextField(
                controller: _subjectController,
                labelText: 'Subject',
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a subject';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 15),
              
              // Message Field
              CustomTextField(
                controller: _messageController,
                labelText: 'Message',
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your message';
                  }
                  if (value.length < 10) {
                    return 'Message must be at least 10 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              
              // Send Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSendMessage,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text('Send Message'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleSendMessage() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isLoading = false;
    });

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Message sent successfully! We\'ll get back to you soon.'),
      ),
    );

    // Clear form
    _subjectController.clear();
    _messageController.clear();
  }
}
