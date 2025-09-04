import { z } from "zod";



const authSchema = z.object({
    email: z.email().min(5).max(60),
    password: z.string().min(6),
    role: z.enum(['customer', 'vendor', 'rider', 'admin']).optional(),
});

type AuthSchemaType = z.infer<typeof authSchema>;

interface ISerializedResponse<T> {
    status: string;
    message: string;
    data: T;
}

type ApiResponse<T> = ISerializedResponse<T>;


const serializeResponse = <T>(status: string, data: T, message: string): ISerializedResponse<T> => ({
    status,
    message,
    data,
});


interface IUserResponse {
    _id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export { authSchema, serializeResponse};
export type { ApiResponse, AuthSchemaType, IUserResponse};