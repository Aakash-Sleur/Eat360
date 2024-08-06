import { useNavigate } from "react-router-dom"

import { categories } from "@/constants"
import { BannerCarousel } from "@/components/shared/banner-carousel"
import { Button } from "@/components/ui/button";

const Home = () => {
    const navigate = useNavigate();

    return (
        <section className="flex flex-1">
            <div className="home-container">
                <BannerCarousel />

                <div className="home-posts">
                    <h3 className="w-full text-left h3-bold md:h2-bold">Categories</h3>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {
                            categories.map((category, idx) => (
                                <Button
                                    key={idx}
                                    onClick={() => navigate(`/explore?category=${category.name}`)}
                                    className="relative p-0 h-72 rounded-t-xl lg:h-92 lg:w-full"
                                >
                                    <div className="w-full h-full">
                                        <img
                                            src={category.image}
                                            alt="post"
                                            className="object-cover w-full h-full rounded-xl"
                                        />

                                        <div className="absolute bottom-0 w-full p-2 rounded-b-3xl bg-dark-1/50">
                                            <p className="text-sm line-clamp-1 text-light-1 lg:text-base">{category.name}</p>
                                        </div>
                                    </div>
                                </Button>

                            )

                            )
                        }
                    </ul>
                </div>
            </div>

        </section>
    )
}

export default Home
