export const sidebarLinks = [
  {
    imgUrl: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgUrl: "/icons/posts.svg",
    route: "/posts",
    label: "Posts",
  },
  {
    imgUrl: "/icons/charts.svg",
    route: "/recipes",
    label: "Recipes",
  },
];

export const banner_carousel_items = [
  {
    name: "breakfast",
    image: "/images/banners/breakfast.webp",
  },
  {
    name: "chinese",
    image: "/images/banners/chinese.webp",
  },
  {
    name: "indian",
    image: "/images/banners/indian.webp",
  },
  {
    name: "japanese",
    image: "/images/banners/japanese.webp",
  },
];

export const footerLinks = [
  {
    imgUrl: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgUrl: "/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgUrl: "/icons/posts.svg",
    route: "/posts",
    label: "Posts",
  },
  {
    imgUrl: "/icons/charts.svg",
    route: "/recipes",
    label: "Recipe",
  },
];

export const categories = [
  {
    name: "Indian",
    image: "/images/dummy/indian.webp",
  },
  {
    name: "Chinese",
    image: "/images/dummy/chinese.jpg",
  },
  {
    name: "Japanese",
    image: "/images/dummy/japanese.jpg",
  },
  {
    name: "breakfast",
    image: "/images/dummy/breakfast.jpg",
  },
  {
    name: "lunch",
    image: "/images/dummy/lunch.webp",
  },
  {
    name: "dinner",
    image: "/images/dummy/dinner.jpg",
  },
];

export const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE == "remote"
    ? import.meta.env.BASE_URL
    : "http://localhost:8080";
