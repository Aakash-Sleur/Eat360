import React from 'react';

import RecipeForm from '@/components/shared/recipe-form';
import { useSearchParams } from 'react-router-dom';

const CreateRecipePage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const forkRecipe = searchParams.get('recipeId') || "";

    console.log(forkRecipe)
    
    return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="justify-start w-full gap-3 mx-auto md:max-w-5xl flex-start">
          <img
            src="/icons/add-post.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="w-full text-left h3-bold md:h2-bold">Create Recipe</h2>
        </div>

        <RecipeForm actions='create' />
      </div>
    </div>
  );
};

export default CreateRecipePage;
