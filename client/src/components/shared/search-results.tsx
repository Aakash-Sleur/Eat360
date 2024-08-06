import Loader from "../loader";
import { IRecipe } from "@/lib/types";
import GridList from "./grid-recipelist";

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchRecipes?: IRecipe[];
}

const SearchResults = ({ isSearchFetching, searchRecipes }: SearchResultsProps) => {
    if (isSearchFetching) {
        return <Loader />
    }
    if (searchRecipes && searchRecipes.length > 0) {
        return <GridList recipes={searchRecipes} />
    }
    return (
        <p className="w-full mt-10 text-center text-light-4">No results found</p>
    )
}

export default SearchResults