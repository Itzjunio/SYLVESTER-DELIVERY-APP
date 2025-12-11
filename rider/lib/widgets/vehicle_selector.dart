import 'package:flutter/material.dart';
import '../models/user.dart';

class VehicleSelector extends StatelessWidget {
  final VehicleType selectedVehicle;
  final ValueChanged<VehicleType> onVehicleChanged;

  const VehicleSelector({
    super.key,
    required this.selectedVehicle,
    required this.onVehicleChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: VehicleType.values.map((vehicle) {
        final isSelected = selectedVehicle == vehicle;
        return Expanded(
          child: GestureDetector(
            onTap: () => onVehicleChanged(vehicle),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 5),
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                border: Border.all(
                  color: isSelected 
                    ? Theme.of(context).primaryColor 
                    : Colors.grey.shade300,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(12),
                color: isSelected 
                  ? Theme.of(context).primaryColor.withOpacity(0.1) 
                  : null,
              ),
              child: Column(
                children: [
                  Icon(
                    _getVehicleIcon(vehicle),
                    size: 24,
                    color: isSelected 
                      ? Theme.of(context).primaryColor 
                      : Colors.grey,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    vehicle.displayName,
                    style: TextStyle(
                      color: isSelected 
                        ? Theme.of(context).primaryColor 
                        : Colors.grey,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  IconData _getVehicleIcon(VehicleType vehicle) {
    switch (vehicle) {
      case VehicleType.bike:
        return Icons.directions_bike;
      case VehicleType.motorbike:
        return Icons.motorcycle;
      case VehicleType.car:
        return Icons.directions_car;
    }
  }
}



