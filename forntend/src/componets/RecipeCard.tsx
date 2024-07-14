import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Recipe } from "../types"

interface Props {
    recipe : Recipe;
    isFavorite: boolean
    onClick:() => void;
    onFavoriteButtonClick:(recipe:Recipe) => void
}


const RecipeCard = ({recipe, onClick,onFavoriteButtonClick,isFavorite}: Props) => {
    return(
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe.image} alt="" />
            <div className="recipe-card-title">
                <span onClick={(event) =>{
                    event.stopPropagation()
                    onFavoriteButtonClick(recipe);
                }}>
                    {isFavorite ? <AiFillHeart size={25} color="Pink"/>: <AiOutlineHeart size={25}/>}
                    
                </span>
                <h3>{recipe.title}</h3>
            </div>
        </div>
    )
}

export default RecipeCard;