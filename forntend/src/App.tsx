import React, { FormEvent, useEffect, useRef, useState } from "react";
import * as api from './api'
import {Recipe} from "./types"

import "./App.css";
import RecipeCard from "./componets/RecipeCard";
import RecipeModal from "./modals/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";
type Tabs = "Search" | "favourites";
const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes,setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe,setSelectedRecipe]  = useState<Recipe | undefined>(undefined);
  const [selectedTab,setSelectedTab] = useState<Tabs>("Search");
  const [favoriteRecipes,setFavoriteRecipes] = useState<Recipe[]>([])
  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavoritesRecipes = async () => {
      try{
        const favoriteRecipes = await api.getFavoriteRecipes();
        setFavoriteRecipes(favoriteRecipes.results);
      }catch(error){
        console.log(error);
      }
    }
    fetchFavoritesRecipes();
  },[])

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try{
        const recipes = await api.searchRecipes(searchTerm,1);
        setRecipes(recipes.results);
        pageNumber.current = 1;
    }
    catch(e){
        console.log(e);
    }
  }

  const handleViewMoreClick = async() =>{
    const nextPage = pageNumber.current + 1;
    try{
      const nextRecipes = await api.searchRecipes(searchTerm,nextPage);
      setRecipes([...recipes,...nextRecipes.results])
      pageNumber.current = nextPage;
    }catch(e){
      console.log(e);

    }
  }

  const addFavoriteRecipe = async (recipe: Recipe) =>{
    try{
      await api.addFavoriteRecipe(recipe);
      setFavoriteRecipes([...favoriteRecipes,recipe])
    }catch(error){
      console.log(error);

    }
  }

  const removeFavoriteReceipe = async(recipe: Recipe)=>{
    try{
      await api.removeFavoriteRecipe(recipe);
      const updatedRecipes = favoriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id);
        setFavoriteRecipes(updatedRecipes);
    }catch(error){
      console.log(error)
    }
  }
  
  return (<div className="app-container">
    <div className="header"><img src="img.jpg" alt="" />
    <div className="title">Recipe app</div>
    </div>
    <div className="tabs">
      <h1 className={selectedTab === "Search" ? "tab-active" : ""}onClick={()=> setSelectedTab("Search")}>Recipe Search</h1>
      <h1 className={selectedTab === "favourites" ? "tab-active" : ""} onClick={()=> setSearchTerm("favourites")}> Favorites</h1>
    </div>
    {selectedTab === "Search" && (<>
      <form onSubmit={(event) => handleSearchSubmit(event)}>
      <input type="text" required 
      placeholder="enter a search term"
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}/>
    <button type="submit">Submit<AiOutlineSearch size={40}/></button>
    </form>
    <div className="recipe-grid">
    {recipes.map((recipe) => {
      const isFavorite = favoriteRecipes.some(
        (favRecipe) => recipe.id === favRecipe.id);
      return(
        <RecipeCard recipe={recipe} 
      onClick={() => setSelectedRecipe(recipe)} 
      onFavoriteButtonClick={isFavorite ? removeFavoriteReceipe : addFavoriteRecipe}
      isFavorite ={isFavorite}/>
      )
    }
      
  
    )}
    </div>

    <button className="view-more-button"
    onClick={handleViewMoreClick}>View More</button></>)}

    {selectedTab === "favourites" && 
      <div className="recipe-grid">
        {favoriteRecipes.map((recipe)=> (
          <RecipeCard recipe={recipe} 
          onClick={()=>setSelectedRecipe(recipe)}
          onFavoriteButtonClick={removeFavoriteReceipe}
          isFavorite={true}
          />)
        )}
      </div>
    }

    {selectedRecipe ? 
    (<RecipeModal recipeId={selectedRecipe.id.toString()}  onClose={() => setSelectedRecipe(undefined)}/> ): null}
  </div>
  )
}

export default App;