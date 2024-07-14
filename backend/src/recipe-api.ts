import { query } from "express";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.API_KEY;

export const searchRecipes = async (serachTerm: string, page:number) => {
    if(!apiKey){
        throw new Error("Api key not found")
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams ={
        apiKey,
        query: serachTerm,
        number:"10",
        offset:(page * 10).toString()
    }

    url.search = new URLSearchParams(queryParams).toString()

    try{

        const serachResponse = await fetch(url);
        const resultJson = await serachResponse.json();
        return resultJson;

    }catch(error){
        console.log(error);

    }

};

export const getRecipeSummary = async (recipeId:string) => {
    if(!apiKey){
        throw new Error("APi key not found")
    }
    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);

    const params = {
        apiKey
    }

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url);
    const json = await response.json();

    return json;


}

export const getFavoriteRecipesByIds = async(ids: String[]) =>{
    if(!apiKey){
        throw new Error("APi key not found")
    }
    const url = new URL('hhtps://api.spoonacular.com/recipes/informationBulk');
    const params = {
        apiKey: apiKey,
        ids: ids.join(",")
    }
    url.search = new URLSearchParams(params).toString();
    const searchResponse = await fetch(url);
    const json = await searchResponse.json();

    return {results: json};

}