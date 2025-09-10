import mongoose, { Schema } from 'mongoose';
import { IOrder, IRestaurant} from '../../types/index';

const RestaurantSchema = new Schema<IRestaurant>({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere',
        }
    },
    menu: [{
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String },
        category: { type: String },
        isAvailable: { type: Boolean, default: true },
    }],
    cuisine: { type: [String], default: [] },
    address: { type: String, required: true },
}, { timestamps: true });


const OrderSchema = new Schema<IOrder>({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    orderStatus: {
        type: String,
        enum: ['pending', 'accepted', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
}, { timestamps: true });



export const RestaurantModel = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
export const OrderModel =  mongoose.model<IOrder>('Order', OrderSchema);
