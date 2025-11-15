import 'package:flutter/material.dart';
import '../services/user_service.dart';
import '../services/earnings_service.dart';
import '../models/earnings.dart';
import '../widgets/stats_card.dart';

class AvailabilityPage extends StatefulWidget {
  const AvailabilityPage({super.key});

  @override
  State<AvailabilityPage> createState() => _AvailabilityPageState();
}

class _AvailabilityPageState extends State<AvailabilityPage> {
  final _userService = UserService();
  final _earningsService = EarningsService();
  late Earnings _earnings;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEarningsData();
  }

  Future<void> _loadEarningsData() async {
    setState(() => _isLoading = true);
    try {
      final earnings = await _earningsService.getEarnings();
      setState(() {
        _earnings = earnings;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load data: $e')),
        );
      }
    }
  }

  Future<void> _toggleOnlineStatus(bool isOnline) async {
    try {
      await _userService.updateOnlineStatus(isOnline);
      setState(() {});
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              isOnline 
                ? 'You are now online and will receive delivery requests'
                : 'You are now offline and will not receive delivery requests',
            ),
            backgroundColor: isOnline ? Colors.green : Colors.orange,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update status: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showScheduleDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Set Schedule'),
        content: const Text('Schedule feature coming soon! You will be able to set your working hours for upcoming days.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _userService.currentUser;
    
    if (user == null) {
      return const Center(
        child: Text('Please login to view availability'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Availability',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 30),
          
          // Online/Offline toggle
          Center(
            child: Column(
              children: [
                Switch(
                  value: user.isOnline,
                  onChanged: _toggleOnlineStatus,
                  activeColor: Colors.green,
                  inactiveThumbColor: Colors.red,
                  inactiveTrackColor: Colors.red.withOpacity(0.3),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: user.isOnline ? Colors.green : Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      user.isOnline ? "You're currently online" : "You're offline",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 5),
                Text(
                  'Receive delivery requests when online',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          
          // Today's stats
          const Text(
            "Today's Stats",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: CircularProgressIndicator(),
              ),
            )
          else
            Column(
              children: [
                // Deliveries and Earnings
                Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: 'Deliveries',
                        value: _earnings.todayDeliveries.toString(),
                        icon: Icons.delivery_dining,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: StatsCard(
                        title: 'Earnings',
                        value: '₵${_earnings.today.toStringAsFixed(2)}',
                        icon: Icons.currency_exchange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                
                // Average time
                Row(
                  children: [
                    Expanded(
                      child: StatsCard(
                        title: 'Avg. Time',
                        value: '${_earnings.averageDeliveryTime.toStringAsFixed(0)}m',
                        icon: Icons.timer,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          
          const SizedBox(height: 20),
          
          // Schedule card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Schedule',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Set your working hours for upcoming days',
                    style: TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 15),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _showScheduleDialog,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Theme.of(context).primaryColor,
                        side: BorderSide(color: Theme.of(context).primaryColor),
                      ),
                      child: const Text('Set Schedule'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}



