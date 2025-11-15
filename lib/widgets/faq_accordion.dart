import 'package:flutter/material.dart';
import 'package:restaurant_manager/constants/app_colors.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class FaqAccordion extends StatefulWidget {
  const FaqAccordion({super.key});

  @override
  State<FaqAccordion> createState() => _FaqAccordionState();
}

class _FaqAccordionState extends State<FaqAccordion> {
  int? _expandedIndex;

  final List<FaqItem> _faqItems = [
    FaqItem(
      question: 'How do I update my menu?',
      answer: 'Go to the Menu Management section to add, edit, or remove items from your menu. You can also toggle availability for each item.',
    ),
    FaqItem(
      question: 'How are payments processed?',
      answer: 'Payments are processed securely through our platform. You\'ll receive payments every week directly to your bank account.',
    ),
    FaqItem(
      question: 'How do I handle order issues?',
      answer: 'If you encounter any issues with orders, you can contact our support team directly through this page for assistance.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Frequently Asked Questions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 20),
            
            ...List.generate(_faqItems.length, (index) {
              final item = _faqItems[index];
              final isExpanded = _expandedIndex == index;
              
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[200]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  children: [
                    // Question Header
                    InkWell(
                      onTap: () {
                        setState(() {
                          _expandedIndex = isExpanded ? null : index;
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(15),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.question,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                            ),
                            Icon(
                              isExpanded 
                                  ? FontAwesomeIcons.chevronUp 
                                  : FontAwesomeIcons.chevronDown,
                              size: 16,
                              color: AppColors.textMuted,
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Answer Content
                    if (isExpanded)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(15, 0, 15, 15),
                        child: Text(
                          item.answer,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppColors.textMuted,
                            height: 1.5,
                          ),
                        ),
                      ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class FaqItem {
  final String question;
  final String answer;

  FaqItem({
    required this.question,
    required this.answer,
  });
}
