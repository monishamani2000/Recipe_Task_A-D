import { initTRPC } from '@trpc/server';
import { z } from 'zod'
import { expressHandler } from 'trpc-playground/handlers/express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const trpcApiEndpoint = '/trpc'
const playgroundEndpoint = '/trpc-playground'
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;



export const appRouter = router({
    addRecipes:publicProcedure
    .input (z.object({
        id:z.number(),
        name: z.string(),
        description: z.string(),
        cookingInstructions: z.string(),
        price: z.number().default(0.0),
        ingredientIds: z.array(z.number()),
      }))
      .mutation(async({ input })=> {
        const { ingredientIds, ...recipeData } = input;
        const ingredients = await prisma.ingredient.findMany({
          where: {
            id: { in: ingredientIds },
          },
        });

        // ____________create recipe
        const createdRecipe = await prisma.recipe.create({
            data: {
              ...recipeData,
              ingredients: {
                connect: ingredients.map((ingredient) => ({ id: ingredient.id })),
              },
            },
            include: {
              ingredients: true,
            },
          });
    
          return createdRecipe;
        },
  ),


//   __________create Ingredient
    createIngredients: publicProcedure
        .input(
            z.object({
                id:z.number(),
                name: z.string(),
                quantity: z.number(),
                unit: z.string(),
                recipeId: z.number(),
            })
        )
        .mutation(async ({ input }) => {
            const { name, quantity, unit,id } = input;
            const ingredient = await prisma.ingredient.create({
                data: {
                    id,
                    name,
                    quantity,
                    unit,

                },
            });
            return ingredient;
        }),


    // createRecipes: publicProcedure
    //     .input(
    //         z.object({
    //             id:z.number(),
    //             name: z.string(),
    //             description: z.string(),
    //             cookingInstructions: z.string(),
    //             price: z.number(),

    //         })
    //     )
    //     .mutation(async ({ input }) => {
    //         const { name, description, cookingInstructions, price,id } = input;
    //         const recipe = await prisma.recipe.create({
    //             data: {
    //                 id,
    //                 name,
    //                 description,
    //                 cookingInstructions,
    //                 price

    //             },
    //         });
    //         return recipe;
    //     }),

    

    getIngredients: publicProcedure
        .query(async () => {
            const ingredients = await prisma.ingredient.findMany({include:{recipes:true,RecipeIngredient:true}})
            return ingredients
        }),
    getRecipes: publicProcedure
        .query(async () => {
            const recipes = await prisma.recipe.findMany({include:{ingredients:true,RecipeIngredient:true}})
            return recipes
        }),

    // Create Customer___________
    createCustomer: publicProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string().email(),
                phoneNumber: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { name, email, phoneNumber } = input;
            const customer = await prisma.customer.create({
                data: {
                    name,
                    email,
                    phoneNumber,
                },
            });
            return customer;
        }),


    // Get Customers______________
    getCustomers: publicProcedure.query(async () => {
        const customers = await prisma.customer.findMany();
        return customers;
    }),


    getRecipeById: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
            const recipe = await prisma.recipe.findUnique({
                where: {
                    id: input,
                },
                include: {
                    ingredients: true,
                },
            });

            if (!recipe) {
                throw new Error('Recipe not found');
            }

            return recipe;
        }),
    // getRecipeByIngredientId: publicProcedure
    //     .input(z.number())
    //     .query(async ({ input }) => {
    //         const ingredient = await prisma.ingredient.findUnique({
    //             where: {
    //                 id: input,
    //             },
    //             include: {
    //                 recipes: true,
    //             },
    //         });

    //         if (!ingredient) {
    //             throw new Error('Ingredient not found');
    //         }

    //         return ingredient.recipes;
    //     }),


    // ______________get recipe by ingredient
    getRecipesByIngredientId: publicProcedure
        .input(z.object({
            ingredientId: z.number(),
        }))
        .query(async ({ input }) => {
            const { ingredientId } = input;
            // Retrieve recipes that contain the provided ingredient ID
            const recipes = await prisma.recipe.findMany({
                where: {
                    ingredients: {
                        some: {
                            id: ingredientId,
                        },                                                              //subtask : one ingredient id get the two recipes 
                    },
                },
                include:{
                    ingredients:true
                }
            });

            return recipes;
        }),

    getRecipesByIngredientName: publicProcedure
        .input(z.string())
        .query(async ({ input }) => {
            const recipes = await prisma.recipe.findMany({
                where: {
                    ingredients: {
                        some: {
                            name: input,
                        },
                    },
                },

            });

            return recipes;
        }),



    updateIngredient: publicProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                quantity: z.number(),
                unit: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, quantity, unit } = input;
            const updatedIngredient = await prisma.ingredient.update({
                where: {
                    id,
                },
                data: {
                    name,
                    quantity,
                    unit,
                },
            });

            return updatedIngredient;
        }),

    updateRecipe: publicProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                cookingInstructions: z.string(),
                price: z.number(),
                ingredients: z.array(
                    z.object({
                        id:z.number(),
                        name: z.string(),
                        quantity: z.number(),
                        unit: z.string(),
                    })
                ),
            })
        )
        .mutation(async ({ input }) => {
            const { id, name, description, cookingInstructions, price, ingredients } = input;
            const updatedRecipe = await prisma.recipe.update({
                where: {
                    id,
                },
                data: {
                    name,
                    description,
                    cookingInstructions,
                    price,
                    ingredients: {
                        deleteMany: {}, // Delete existing ingredients
                        create: ingredients, // Create updated ingredients
                    },
                },
                include: {
                    ingredients: true,
                },
            });

            return updatedRecipe;
        }),

    // Delete Ingredient
    deleteIngredient: publicProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            const deletedIngredient = await prisma.ingredient.delete({
                where: {
                    id: input,
                },
            });

            return deletedIngredient;
        }),

    // Delete Recipe
    deleteRecipe: publicProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
            const deletedRecipe = await prisma.recipe.delete({
                where: {
                    id: input,
                },
            });

            return deletedRecipe;
        }),


        // _____________order table based
    createOrder: publicProcedure
        .input(z.object({
            name: z.string(),
            street: z.string(),
            post: z.string(),
            city: z.string()
        }))
        .mutation(async (opts) => {
            const { name, street, post, city } = opts.input

            const orderedItem = await prisma.orders.create({
                data: {
                    name, street, post, city
                }
            })
            return orderedItem
        }),

        // __________get the order 
    orderList: publicProcedure
        .query(async () => {
            const OrderedList = await prisma.orders.findMany()
            return OrderedList
        }),

});




export type AppRouter = typeof appRouter;
const runApp = async () => {
    app.use(cors())
    app.use(trpcApiEndpoint, createExpressMiddleware({ router: appRouter }))
    app.use(playgroundEndpoint, await expressHandler({ trpcApiEndpoint, playgroundEndpoint, router: appRouter }))
    app.listen(3010, () => console.log('Server started on port 3010'));
}
runApp()