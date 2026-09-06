const { z } = require("zod");

const registerSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email(),

        password: z
            .string()
            .min(8)
            .max(100),

        fullName: z
            .string()
            .min(2)
            .max(150)
    }),

    params: z.object({}),

    query: z.object({})
});

const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email(),

        password: z
            .string()
            .min(1)
    }),

    params: z.object({}),

    query: z.object({})
});

module.exports = {
    registerSchema,
    loginSchema
};