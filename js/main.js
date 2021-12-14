import { recipes } from "./recipes.js";

// global variables
const result = document.querySelector(".cards");
const searchInputGlobal = document.getElementById("search-global-input");

// function which creates recipe's HTML
const createRecipeElem = (recipe) => {
  let recipeHtml = document.createElement("div");
  recipeHtml.classList.add("recipe");

  let pIngredients = "";

  // loop through ingredients
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
};

// display recipes
recipes.forEach((recipe) => createRecipeElem(recipe));

let idsDisplayedRecipe = [];
console.log("idsDisplayedRecipe", idsDisplayedRecipe);

// listen to the input in the global search and sort recipes corresponding to that input
searchInputGlobal.addEventListener("keyup", (e) => {
  // check if at least 3 characters have been entred in the input field
  if (searchInputGlobal.validity.valid) {
    console.log("is valid");

    // get the user's input value
    const inputGlobalValue = searchInputGlobal.value.toLowerCase();
    console.log(inputGlobalValue);

    // empty the gallery
    result.innerHTML = "";

    // initialise booleans
    let isIncluded = false;
    let isAnyIncluded = []; // booleans true if value included in the recipe
    console.log("isAnyIncluded", isAnyIncluded);

    // loop through recipes
    recipes.forEach((recipe) => {
      let arrayOfBooleans = []; // booleans true/false depending if value included in ingredients

      // loop through ingredients
      recipe.ingredients.forEach((ingredient) => {
        arrayOfBooleans.push(
          ingredient.ingredient.toLowerCase().includes(inputGlobalValue)
        );
      });

      // check if the input text is included in recipes
      isIncluded =
        recipe.name.toLowerCase().includes(inputGlobalValue) ||
        recipe.description.toLowerCase().includes(inputGlobalValue) ||
        arrayOfBooleans.some((item) => item === true);

      console.log("isIncluded:", isIncluded);

      // display the targeted recipe
      if (isIncluded === true) {
        console.log("ID recipe to show", recipe.id);
        createRecipeElem(recipe);
        isAnyIncluded.push(isIncluded);
        idsDisplayedRecipe.push(recipe.id);
      }
    });
    if (!isAnyIncluded.some((item) => item === true)) {
      result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
        chercher « tarte aux pommes », « poisson », etc.</p>`;
    }
  }
});

const divListAppliance = document.querySelector(".search-tag-list__appliance");
const inputAppliance = document.getElementById("search-tag-input__appliance");

// const appliances = recipes.map((recipe) => recipe.appliance);
// console.log(appliances);

// const appliancesUniqueValues = [...new Set(appliances)];
// console.log(appliancesUniqueValues);

// const appliancesDisplayed = (id) => {
//   if (id === recipe.id) {
//     console.log(recipe.appliance);
//     appliancesUniqueValues.includes(recipe.appliance);
//   }
// };

// idsDisplayedRecipe.forEach((id) => appliancesDisplayed(id));

// const createHtml = () => {
//   divListAppliance.innerHTML = "";

//   let liTags = "";
//   appliancesUniqueValues.forEach((value) => {
//     liTags += `<li>${value}</li>`;
//   });

//   divListAppliance.innerHTML = `<ul>${liTags}</ul>`;
//   console.log(divListAppliance.innerHTML);
// };

// inputAppliance.addEventListener("keyup", (e) => {
//   createHtml();
// });

// const chevronAppliance = document.querySelector(".search-tag-button__appliance input");
// chevronAppliance.addEventListener("click", (e) => {

// });

console.log("idsDisplayedRecipe", idsDisplayedRecipe);

let applianceIncluded = [];
console.log(applianceIncluded);
let includes = false;
console.log(includes);

recipes.forEach((recipe) => {
  includes = idsDisplayedRecipe.includes(recipe.id);
  if (includes) {
    console.log(recipe.id, recipe.appliance);
    applianceIncluded.push(recipe.appliance);
  }
});
