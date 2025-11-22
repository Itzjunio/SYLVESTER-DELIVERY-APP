import mongoose from "mongoose";
import { IOrder, IRestaurant, IPayOut, IDisputes } from "../../types/";
export declare const RestaurantModel: mongoose.Model<IRestaurant, {}, {}, {}, mongoose.Document<unknown, {}, IRestaurant, {}, {}> & IRestaurant & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const OrderModel: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const PayOutModel: mongoose.Model<IPayOut, {}, {}, {}, mongoose.Document<unknown, {}, IPayOut, {}, {}> & IPayOut & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const DisputeModel: mongoose.Model<IDisputes, {}, {}, {}, mongoose.Document<unknown, {}, IDisputes, {}, {}> & IDisputes & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=models.d.ts.map