import React from 'react';

import RecipeForm from '@/components/shared/recipe-form';

const CreateRecipePage: React.FC = () => {
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
