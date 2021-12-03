import { recipes } from "./recipes.js";

const result = document.querySelector(".cards");

// let ingredients = "\n";
// for (let recipe of recipes) {
//   console.log(typeof recipe.ingredients[0].ingredient);
//   ingredients += `<p class="ingredient">${recipe.ingredients[0].ingredient}</p>`;
// }

let ingredients = "";

recipes.forEach((recipe) => {
  const recipeHtml = document.createElement("div");
  recipeHtml.classList.add("recipe");
  recipeHtml.innerHTML = `<div class="image"></div>
                            <h2>${recipe.name}</h2>
                            <i class="far fa-clock"></i><h2>${recipe.time} min</h2>
                            <div class="ingredients">${ingredients}</div>`;
  result.appendChild(recipeHtml);
});

ingredients = document.querySelector(".ingredients");

recipes.forEach((recipe) => {
  recipe.ingredients.forEach((ingredient) => {
    console.log(ingredient);
    const ingredientHtml = document.createElement("p");
    ingredientHtml.classList.add("ingredient");
    ingredientHtml.innerHTML = `${ingredient.ingredient} ${ingredient.quantity} ${ingredient.unit}`;
    ingredients.appendChild(ingredientHtml);
  });
});
