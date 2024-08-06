import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Square } from "lucide-react";

import Loader from "@/components/loader";
import { useGetRecipeById, useGetUserById } from "@/lib/react-query/queries-and-mutations";

const PrintPage = () => {
    const { id } = useParams();
    const { data: recipe } = useGetRecipeById(id || "");
    const { data: author } = useGetUserById(recipe?.createdBy || "");

    useEffect(() => {
        window.print();
    }, []);

    if (!recipe || !author) return <Loader />;

    const date = (new Date(recipe.createdAt)).toDateString();

    return (
        <main className="max-w-5xl p-4 mx-auto">
            <img src="/images/logo.png" alt="logo" className="w-20 h-20 mb-5" />
            <article className="p-4 space-y-4">
                <header className="space-y-4">
                    <h1 className="text-3xl font-bold font-playwright-england">{recipe.title}</h1>
                    <p className="font-poppins">{recipe.description}</p>
                </header>
                <footer className="flex items-center space-x-2 font-semibold font-poppins">
                    <span>By {author.name}</span>
                    <span>|</span>
                    <span>Updated on {date}</span>
                </footer>
            </article>
            <section className="w-full p-4 space-y-4">
                <h2 className="text-2xl font-bold font-playwright-england">Ingredients</h2>
                <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-center gap-4 font-poppins">
                            <Square size={25} />
                            <span>{ingredient.name} {ingredient.quantity}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="w-full p-4 space-y-4">
                <h2 className="text-2xl font-bold font-playwright-england">Instructions</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }} />
            </section>

            <p className="my-10 text-4xl text-center font-playwright-england">Make this with full heart and enjoy!</p>

            <p className="font-bold text-center font-poppins">
                © 2024 Eat360. All rights reserved.
            </p>
        </main>
    );
};

export default PrintPage;
