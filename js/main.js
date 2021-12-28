import { recipes } from "./recipes.js";

// global variables
const result = document.querySelector(".cards");
const searchInputGlobal = document.getElementById("search-global-input");
const divListAppliance = document.querySelector(".search-tag-list__appliance");
const inputAppliance = document.getElementById("search-tag-input__appliance");
const chevronAppliance = document.querySelector(
  ".search-tag-button__appliance i.fa-chevron-down"
);
let divListApplianceLi = null;
const divFilteredList = document.querySelector(
  ".selected-tags .selected-wrapper ul"
);
let liElem = null;
let closeFiltred = null;

let idsDisplayedRecipe = [];
const selectedApplianceTags = [];

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
  return recipeHtml;
};

// display recipes and stock ids of displayed recipes
recipes.forEach((recipe) => {
  createRecipeElem(recipe);
  idsDisplayedRecipe.push(recipe.id);
});
console.log("idsDisplayedRecipe", idsDisplayedRecipe);

// function which retrieves value from global input and displays corresponding recipes
const globalInputSearch = () => {
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

    // check that the input text is included in recipes
    isIncluded =
      recipe.name.toLowerCase().includes(inputGlobalValue) ||
      recipe.description.toLowerCase().includes(inputGlobalValue) ||
      arrayOfBooleans.some((item) => item === true);

    console.log("isIncluded:", isIncluded);

    // display the targeted recipes and stock ids of displayed recipes
    if (isIncluded) {
      console.log("ID recipe to show", recipe.id);
      createRecipeElem(recipe);
      isAnyIncluded.push(isIncluded);
      idsDisplayedRecipe.push(recipe.id);
    }
    // display a message when there isn't any recipe which includes the input value
    if (!isAnyIncluded.some((item) => item === true)) {
      result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
        chercher « tarte aux pommes », « poisson », etc.</p>`;
    }
  });
};
// register keyup event on the global search input
searchInputGlobal.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (searchInputGlobal.validity.valid) {
    console.log("input is valid");
    globalInputSearch();
  }
});

// function which extracts appliance tags (included in currently displayed recipes) into an array
const extractIncludedTags = () => {
  let includedTags = [];

  recipes.forEach((recipe) => {
    if (idsDisplayedRecipe.includes(recipe.id)) {
      includedTags.push(recipe.appliance);
    }
  });

  let includedTagsUnique = [...new Set(includedTags)];
  console.log(includedTagsUnique);

  return includedTagsUnique;
};

// function which creates tag's list HTML and register event on each tag
const createLiTags = (tagList, parentElem) => {
  parentElem.innerHTML = "";

  let liTags = "";
  tagList.forEach((tag) => {
    liTags += `<li>${tag}</li>`;
  });

  parentElem.innerHTML = `<ul>${liTags}</ul>`;

  divListApplianceLi = document.querySelectorAll(
    "div.search-tag-list__appliance ul li"
  );

  // register click event on each tag -> display corresponding recipes and tag list, create selected tag's HTML
  divListApplianceLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e);
      createLiTags(extractIncludedTags(), divListAppliance);
      createSelectedElem(filterByTag(e), divFilteredList);
      selectedApplianceTags.push(filterByTag(e));
    });
  });
  console.log(selectedApplianceTags);
};

// function which filter recipes by appliance tag
const filterByTag = (e) => {
  let tempIds = [];
  let clickedTag = e.target.textContent;
  result.innerHTML = "";

  recipes.forEach((recipe) => {
    if (
      idsDisplayedRecipe.includes(recipe.id) &&
      recipe.appliance === clickedTag
    ) {
      createRecipeElem(recipe);
      tempIds.push(recipe.id);
    }
  });
  idsDisplayedRecipe = tempIds;
  return clickedTag;
};

// function which creates selected tag's HTML
const createSelectedElem = (selectedTag, parentElem) => {
  liElem = document.createElement("li");
  liElem.classList.add("selected-tag");
  // liElem.setAttribute("id", `${selectedTag.toLowerCase()}`);
  liElem.innerHTML += `${selectedTag} &emsp;<i class="far fa-times-circle"></i>`;

  parentElem.appendChild(liElem);

  closeFiltred = document.querySelector("i.fa-times-circle");

  // register click event on closing icon -> trial to re-fiter recipes
  closeFiltred.addEventListener("click", (e) => {
    // console.log(selectedApplianceTags);
    // console.log(selectedTag);
    // console.log(liElem);
    const index = selectedApplianceTags.indexOf(selectedTag);
    selectedApplianceTags.splice(index, 1);
    // console.log(selectedApplianceTags);
    if (liElem.textContent.includes(selectedTag)) {
      divFilteredList.removeChild(liElem); // comment preciser l'enfant a retirer ? avec id de liElem ?
    }
    globalInputSearch();
    createLiTags(extractIncludedTags(), divListAppliance);
  });
};

// register click event on the appliance search input -> display appliance tags (included in currently displayed recipes)
inputAppliance.addEventListener("click", (e) => {
  createLiTags(extractIncludedTags(), divListAppliance);
});

// register click event on the appliance chevron icon -> display appliance tags (included in currently displayed recipes)
chevronAppliance.addEventListener("click", (e) => {
  createLiTags(extractIncludedTags(), divListAppliance);
});

// register keyup event on the appliance search input -> display corresponding recipes and filtered tags
inputAppliance.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (inputAppliance.validity.valid) {
    // get the user's input value
    const inputApplianceValue = inputAppliance.value.toLowerCase();
    console.log(inputApplianceValue);

    // empty the gallery
    result.innerHTML = "";

    // initialise variables
    let isApplianceIncluded = false;
    let isAnyApplianceIncluded = []; // booleans true if value included in the recipe
    let tempIds = []; // temporary variable

    console.log("isAnyApplianceIncluded", isAnyApplianceIncluded);
    console.log("idsDisplayedRecipe", idsDisplayedRecipe);
    console.log("tempIdsDisplayedRecipe", tempIds);

    // loop through recipes
    recipes.forEach((recipe) => {
      isApplianceIncluded = recipe.appliance // PAS POSSIBLE <- comment faire pour generaliser ca en fonction qui marche aussi pour ustensiles et ingredients ?
        .toLowerCase()
        .includes(inputApplianceValue);

      // display the targeted recipe and stock ids of displayed recipes
      if (isApplianceIncluded && idsDisplayedRecipe.includes(recipe.id)) {
        console.log("ID recipe to show", recipe.id);
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
        isAnyApplianceIncluded.push(idsDisplayedRecipe.includes(recipe.id));
      }
    });
    idsDisplayedRecipe = tempIds;
    console.log("idsDisplayedRecipe", idsDisplayedRecipe);

    // display the targeted tags
    createLiTags(extractIncludedTags(), divListAppliance);

    // if there isn't any recipe which includes the input value then display the message
    if (!isAnyApplianceIncluded.some((item) => item === true)) {
      result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
         chercher « tarte aux pommes », « poisson », etc.</p>`;
    }
  }
});
