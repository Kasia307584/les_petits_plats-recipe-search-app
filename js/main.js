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
recipes.forEach((recipe) => idsDisplayedRecipe.push(recipe.id));
console.log("idsDisplayedRecipe", idsDisplayedRecipe);

// listen to input in the global search and display corresponding recipes
searchInputGlobal.addEventListener("keyup", (e) => {
  // check if at least 3 characters have been entred in the input field
  if (searchInputGlobal.validity.valid) {
    console.log("input is valid");

    // get the user's input value
    const inputGlobalValue = searchInputGlobal.value.toLowerCase();
    console.log(inputGlobalValue);

    // empty the gallery and the global variable
    result.innerHTML = "";
    idsDisplayedRecipe = [];
    console.log("idsDisplayedRecipe", idsDisplayedRecipe);

    // initialise booleans
    let isIncluded = false;
    let isAnyIncluded = []; // list of booleans true if value included in the recipe
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
    // if there isn't any recipe which includes the input value then display the message
    if (!isAnyIncluded.some((item) => item === true)) {
      result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
        chercher « tarte aux pommes », « poisson », etc.</p>`;
    }
  }
});

const divListAppliance = document.querySelector(".search-tag-list__appliance");
const inputAppliance = document.getElementById("search-tag-input__appliance");
const chevronAppliance = document.querySelector(
  ".search-tag-button__appliance i.fa-chevron-down"
);

// function which extracts into array appliance tags included in currently displayed recipes
const extractIncluded = () => {
  let includedTags = [];
  console.log(includedTags);

  recipes.forEach((recipe) => {
    if (idsDisplayedRecipe.includes(recipe.id)) {
      includedTags.push(recipe.appliance);
    }
  });

  let includedTagsUnique = [...new Set(includedTags)];
  console.log(includedTagsUnique);

  return includedTagsUnique;
};

// function which displays appliance tags (included in currently displayed recipes)
const displayTags = (tagList, parentElem) => {
  parentElem.innerHTML = "";

  let liTags = "";
  tagList.forEach((tag) => {
    liTags += `<li>${tag}</li>`;
  });

  parentElem.innerHTML = `<ul>${liTags}</ul>`;
};

// listen to click and display appliance tags (included in currently displayed recipes)
inputAppliance.addEventListener("click", (e) => {
  displayTags(extractIncluded(), divListAppliance);
  console.log("idsDisplayedRecipe", idsDisplayedRecipe);
});

// listen to click and display appliance tags (included in currently displayed recipes)
chevronAppliance.addEventListener("click", (e) => {
  displayTags(extractIncluded(), divListAppliance);
});

// listen to input in the appliance search and display corresponding recipes and filtered tags
inputAppliance.addEventListener("keyup", (e) => {
  if (inputAppliance.validity.valid) {
    // get the user's input value
    const inputApplianceValue = inputAppliance.value.toLowerCase();
    console.log(inputApplianceValue);

    // empty the gallery
    result.innerHTML = "";

    // initialise booleans
    let isApplianceIncluded = false;
    let isAnyApplianceIncluded = []; // booleans true if value included in the recipe
    console.log("isAnyApplianceIncluded", isAnyApplianceIncluded);

    // loop through recipes
    recipes.forEach((recipe) => {
      // check if the input text is included in recipes
      isApplianceIncluded = recipe.appliance // recipe.appliance doit être restreint aux appliances contenus dans les recettes affichées
        .toLowerCase()
        .includes(inputApplianceValue);
      console.log("isApplianceIncluded:", isApplianceIncluded);

      // display the targeted recipe
      if (isApplianceIncluded === true) {
        console.log("ID recipe to show", recipe.id);
        createRecipeElem(recipe);
        isAnyApplianceIncluded.push(isApplianceIncluded);
        idsDisplayedRecipe.push(recipe.id); // je dois d'abord la vider ?
        // includedTags.push(recipe.appliance) -> dois je faire ça + d'abord la vider ?
      }
    });
    if (!isAnyApplianceIncluded.some((item) => item === true)) {
      result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
         chercher « tarte aux pommes », « poisson », etc.</p>`;
    }
  }
});
