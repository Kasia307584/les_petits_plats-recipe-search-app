import { recipes } from "./recipes.js";

const result = document.querySelector(".cards");
const searchInputGlobal = document.getElementById("searchInput");

let recipeHtml = "";

const createRecipeElem = (recipe) => {
  recipeHtml = document.createElement("div");
  recipeHtml.classList.add("recipe");

  let pIngredients = "";

  for (let ingredient of recipe.ingredients) {
    pIngredients += `<div class="ingredient"><span class="ingredient__name">${
      ingredient.ingredient
    }:</span> ${ingredient.quantity ? ingredient.quantity : ""} ${
      ingredient.unit ? ingredient.unit : ""
    }</div>`;
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

  result.appendChild(recipeHtml);
  return recipeHtml;
};

recipes.forEach((recipe) => createRecipeElem(recipe));

searchInputGlobal.addEventListener("keyup", (e) => {
  if (searchInput.validity.valid) {
    console.log("is valid");

    const inputGlobalValue = searchInputGlobal.value.toLowerCase();
    console.log(inputGlobalValue);

    let include = true;
    result.innerHTML = "";
    recipes.forEach((recipe) => {
      include =
        recipe.name.toLowerCase().includes(inputGlobalValue) ||
        recipe.description.toLowerCase().includes(inputGlobalValue);
      if (include === true) {
        console.log("ID recipe to show", recipe.id);
        createRecipeElem(recipe);
      }
    });
  }
});
