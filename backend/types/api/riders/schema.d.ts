import { z } from "zod";
export declare const orderStausSchema: z.ZodObject<{
    status: z.ZodEnum<{
        "in-transit": "in-transit";
        delivered: "delivered";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map