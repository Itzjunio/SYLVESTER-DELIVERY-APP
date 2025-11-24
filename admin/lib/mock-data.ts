export const customers = [
  { id: 1, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 12, joined: '2025-01-12' },
  { id: 2, name: 'James Lee', email: 'james@example.com', orders: 5, joined: '2025-02-04' },
  { id: 3, name: 'Maria Gomez', email: 'maria@example.com', orders: 8, joined: '2025-03-21' }
];

export const riders = [
  { id: 1, name: 'Mike Johnson', status: 'Online', deliveries: 120, rating: 4.8 },
  { id: 2, name: 'Alice Kim', status: 'Offline', deliveries: 85, rating: 4.6 }
];

export const restaurants = [
  { id: 1, name: 'Pizza Palace', category: 'Italian', status: 'Online', rating: 4.7 },
  { id: 2, name: 'Burger House', category: 'Fast Food', status: 'Offline', rating: 4.2 }
];

export const orders = [
  { id: 101, customer: 'Sarah Wilson', restaurant: 'Pizza Palace', status: 'Delivered', total: 24.99 },
  { id: 102, customer: 'James Lee', restaurant: 'Burger House', status: 'Pending', total: 18.5 },
  { id: 103, customer: 'Maria Gomez', restaurant: 'KFC', status: 'Cancelled', total: 12.0 }
];
