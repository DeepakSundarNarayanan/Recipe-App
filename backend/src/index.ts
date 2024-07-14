import express from 'express';
import cors from 'cors';
import * as RecipeApi from './recipe-api';
import {PrismaClient} from '@prisma/client'
const app = express(); 
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors())

app.get("/api/recipes/search", async(req, res) =>{

    const serachTerm = req.query.serachTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await RecipeApi.searchRecipes(serachTerm,page);

    return res.json(results);
})

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
    const recipeId = req.params.recipeId;
    const results = await RecipeApi.getRecipeSummary(recipeId);
    return res.json(results)
})

app.post("/api/recipes/favorite", async (req,res)=>{
    const recipeId = req.body.recipeId;

    try{
        const favoriteRecipe = await prismaClient.favoriteRecipes.create(
            {
                data:{
                    recipeId:recipeId
                }
            }
        )
        return res.status(201).json(favoriteRecipe)
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "something went wrong"})
    }
})

app.get("/api/recipes/favorite", async(req,res) => {
    try{
        const recipes = await prismaClient.favoriteRecipes.findMany();
        const recipeIds = recipes.map((recipe)=> recipe.recipeId.toString())
        const favorites = await RecipeApi.getFavoriteRecipesByIds(recipeIds)
        return res.json(favorites);
    }catch(error){

        console.log(error);
        return res.status(500).json({error: "something went wrong"})

    }
})

app.delete("/api/recipes/favorite",async(req,res) =>{
    const recipeId = req.body.recipeId;

    try{
        await prismaClient.favoriteRecipes.delete({
            where:{
                recipeId: recipeId
            }
        })
        return res.status(204).send()
    }
    catch(er){
        console.log(er);
        return res.status(500).json({error: "something went wrong"})
    }
} )
app.listen(5000,() => {
    console.log("server running")
})