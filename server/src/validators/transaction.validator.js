const { z } = require("zod");

const createTransactionSchema = z.object({
    body: z.object({
        merchant: z
            .string()
            .trim()
            .min(2, "Merchant is required")
            .max(120, "Merchant name is too long"),

        amount: z
            .number({
                required_error: "Amount is required",
                invalid_type_error: "Amount must be a number"
            })
            .positive("Amount must be greater than 0")
            .max(100000000, "Amount is too large"),

        currency: z
            .string()
            .trim()
            .length(3, "Currency must be a 3-letter code")
            .transform((value) => value.toUpperCase()),

        deviceId: z
            .string()
            .trim()
            .min(2, "Device ID is required")
            .max(150, "Device ID is too long")
            .optional(),

        locationCity: z
            .string()
            .trim()
            .min(2, "Location city is too short")
            .max(100, "Location city is too long")
            .optional(),

        transactionType: z
            .enum([
                "purchase",
                "transfer",
                "withdrawal",
                "payment",
                "refund"
            ])
            .default("purchase")
    }),

    params: z.object({}),

    query: z.object({})
});


const transactionIdSchema = z.object({
    params: z.object({
        transactionId: z
            .string()
            .uuid("Invalid transaction ID")
    }),

    body: z.object({}),

    query: z.object({})
});


module.exports = {
    createTransactionSchema,
    transactionIdSchema
};