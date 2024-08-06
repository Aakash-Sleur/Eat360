import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO } from "date-fns";

import { IRecipe, IUser } from "./types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const convertFileToUrl = (file: File) => URL.createObjectURL(file);

function setUserCredentials(user: IUser) {
  localStorage.setItem("userId", user._id);

  const expirationTime = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;

  // Store expiration time in localStorage
  localStorage.setItem("expirationTime", expirationTime.toString());
}

const checkIfExist = (list: string[], userId: string) => {
  return list.includes(userId);
};

const getAdjustedIngredients = (recipe: IRecipe, numPeople: number) => {
  return recipe.ingredients.map((ingredient) => {
    const match = ingredient.quantity.match(/^(\d*\.?\d+)\s*(.*)$/);
    if (!match) {
      return ingredient; // Return the ingredient unchanged if it doesn't match the pattern
    }

    const [, amount, unit] = match;
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      return ingredient; // Return the ingredient unchanged if the amount is not a number
    }

    const adjustedAmount = Math.round(amountNumber * (numPeople || 1));

    return {
      ...ingredient,
      quantity: `${adjustedAmount} ${unit}`,
    };
  });
};

const getRandomColor = () => {
  const color = [
    "text-red",
    "text-green-500",
    "text-blue-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-orange-500",
  ];

  return color[Math.floor(Math.random() * color.length)];
};

const getRelativeTime = (dateString: string) => {
  const date = parseISO(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export {
  cn,
  convertFileToUrl,
  setUserCredentials,
  checkIfExist,
  getRandomColor,
  getRelativeTime,
  getAdjustedIngredients,
};
