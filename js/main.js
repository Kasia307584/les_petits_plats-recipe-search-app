import { recipes } from "./recipes.js";

const result = document.querySelector(".cards");

const createRecipeElem = (recipe) => {
  const recipeHtml = document.createElement("div");
  recipeHtml.classList.add("recipe");

  let pIngredients = "";

  for (let ingredient of recipe["ingredients"]) {
    pIngredients += `<div class="ingredient"><span class="ingredient__name">${ingredient.ingredient}:</span> ${ingredient.quantity} ${ingredient.unit}</div>`;
  }

  recipeHtml.innerHTML = `<div class="image"></div>
                          <div class="text">
                            <div class="recipe-header">
                              <h2>${recipe.name}</h2>
                              <div class="time"><i class="far fa-clock"></i><h2>${recipe.time} min</h2></div>
                            </div>
                            <div class="recipe-core">
                              <div class="ingredients">${pIngredients}</div>
                              <p class"description">${recipe.description}</p>
                            </div>
                          </div>`;

  // return recipeHtml;
  result.appendChild(recipeHtml);
};

recipes.forEach((recipe) => createRecipeElem(recipe));
