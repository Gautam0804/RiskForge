const { z } = require("zod");

const createTransactionSchema = z.object({
    body: z.object({
        userId: z
            .string()
            .uuid()
            .optional(),

        merchant: z
            .string()
            .min(1)
            .max(150),

        amount: z
            .number()
            .positive(),

        currency: z
            .string()
            .max(10)
            .default("INR"),

        deviceId: z
            .string()
            .max(150)
            .optional(),

        ipAddress: z
            .string()
            .optional(),

        locationCity: z
            .string()
            .max(100)
            .optional(),

        latitude: z
            .number()
            .optional(),

        longitude: z
            .number()
            .optional(),

        transactionType: z
            .string()
            .max(30)
            .default("purchase")
    }),

    params: z.object({}),

    query: z.object({})
});

const transactionIdSchema = z.object({
    body: z.object({}),

    params: z.object({
        transactionId: z
            .string()
            .min(1)
    }),

    query: z.object({})
});

module.exports = {
    createTransactionSchema,
    transactionIdSchema
};