import {z} from "zod";

export const event = z.object({
    body: z.object({
        name: z.string()
        .min(5,{message:"aaaa"})
        .max(200,{message:"aaa"})
        
    })
})

