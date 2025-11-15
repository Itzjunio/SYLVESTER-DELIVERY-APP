import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:restaurant_manager/widgets/faq_accordion.dart';
import 'package:restaurant_manager/widgets/contact_support_form.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Help & Support'),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Implement call support
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Call support: +1 (555) 123-4567'),
                ),
              );
            },
            icon: const Icon(FontAwesomeIcons.phone),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // FAQ Section
            const FaqAccordion(),
            const SizedBox(height: 20),
            
            // Contact Support Section
            const ContactSupportForm(),
          ],
        ),
      ),
    );
  }
}
