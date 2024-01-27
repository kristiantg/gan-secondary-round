import { z } from "zod";

export const cityByTagQuerySchema = z.object({
    query: z.object({
      tag: z.string({
        required_error: "Tag is required",
      }),
      isActive: z.string().toLowerCase().transform((x) => x === 'true').pipe(z.boolean())
    }),
  });

export const cityByDistanceQuerySchema = z.object({
  query: z.object({
    to: z.string().uuid(),
    from: z.string().uuid()
  })
})

export const getByIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
})

export const findCitiesWithinDistanceSchema = z.object({
  query: z.object({
    distance: z.coerce.number(),
    from: z.string().uuid()
  })
})