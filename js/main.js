import { recipes } from "./recipes.js";

// global variables
const result = document.querySelector(".cards");
const searchInputGlobal = document.getElementById("search-global-input");
const divListAppliance = document.querySelector(".search-tag-list__appliance");
const divListUstensils = document.querySelector(".search-tag-list__ustensils");
const divListIngredients = document.querySelector(
  ".search-tag-list__ingredients"
);
const inputAppliance = document.getElementById("search-tag-input__appliance");
const inputUstensil = document.getElementById("search-tag-input__ustensil");
const inputIngredient = document.getElementById("search-tag-input__ingredient");
const chevronAppliance = document.querySelector(
  ".search-tag-button__appliance i.fa-chevron-down"
);
let divListApplianceLi = null;
let divListUstensilsLi = null;
let divListIngredientsLi = null;
const divFilteredList = document.querySelector(
  ".selected-tags .selected-wrapper ul"
);

let idsDisplayedRecipe = [];
const selectedApplianceTags = [];
const selectedUstensilsTags = [];

// function which normalise the format of a tag
const normalise = (elem) => elem[0].toUpperCase() + elem.slice(1).toLowerCase();

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

  // initialise booleans
  let isIncluded = false;
  let isAnyIncluded = []; // list of booleans true if value included in the recipe

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

    // display the targeted recipes and stock ids of displayed recipes
    if (isIncluded) {
      createRecipeElem(recipe);
      isAnyIncluded.push(isIncluded);
      idsDisplayedRecipe.push(recipe.id);
    }
  });
  // display a message when there isn't any recipe which includes the input value
  if (!isAnyIncluded.some((item) => item === true)) {
    result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
      chercher « tarte aux pommes », « poisson », etc.</p>`;
  }
  console.log("idsDisplayedRecipe", idsDisplayedRecipe);
};
// register keyup event on the global search input -> display corresponding recipes
searchInputGlobal.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (searchInputGlobal.validity.valid) {
    globalInputSearch();
  }
});

// function which extracts tags (included in currently displayed recipes) into an array; return the array
const extractIncludedTags = (recipeElemType) => {
  let includedTags = [];
  recipes.forEach((recipe) => {
    if (idsDisplayedRecipe.includes(recipe.id)) {
      if (recipe[recipeElemType] === recipe.ingredients) {
        recipe.ingredients.forEach((ingredient) => {
          includedTags.push(ingredient.ingredient);
        });
      } else if (recipe[recipeElemType] === recipe.ustensils) {
        let normalised = [];
        recipe[recipeElemType].forEach((elem) => {
          normalised.push(normalise(elem));
        });
        includedTags = includedTags.concat(normalised);
      } else {
        includedTags.push(recipe[recipeElemType]);
      }
    }
  });
  let includedTagsUnique = [...new Set(includedTags)];

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
  divListUstensilsLi = document.querySelectorAll(
    "div.search-tag-list__ustensils ul li"
  );
  divListIngredientsLi = document.querySelectorAll(
    "div.search-tag-list__ingredients ul li"
  );

  // register click event on each tag -> display corresponding recipes and tag list, create selected tag's HTML
  divListApplianceLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e, "appliance");
      createLiTags(extractIncludedTags("appliance"), divListAppliance);
      createSelectedElem(e.target.textContent, divFilteredList);
      selectedApplianceTags.push(e.target.textContent);
      console.log("selectedApplianceTags", selectedApplianceTags);
    });
  });

  divListUstensilsLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e, "ustensils");
      createLiTags(extractIncludedTags("ustensils"), divListUstensils);
      createSelectedElem(e.target.textContent, divFilteredList);
      selectedUstensilsTags.push(e.target.textContent);
      console.log("selectedUstensilsTags", selectedUstensilsTags);
    });
  });
};

// function which filter recipes by clicked tag
const filterByTag = (event, recipeElemType) => {
  let tempIds = [];
  let clickedTag = event.target.textContent;
  result.innerHTML = "";
  console.log(idsDisplayedRecipe);

  recipes.forEach((recipe) => {
    let normalised = [];
    if (Array.isArray(recipe[recipeElemType])) {
      recipe[recipeElemType].forEach((elem) => {
        normalised.push(normalise(elem));
      });
    }
    if (
      idsDisplayedRecipe.includes(recipe.id) &&
      (recipe[recipeElemType] === clickedTag || normalised.includes(clickedTag))
    ) {
      createRecipeElem(recipe);
      tempIds.push(recipe.id);
    }
  });
  idsDisplayedRecipe = tempIds;
  console.log(idsDisplayedRecipe);
};

// function which filter recipes by selected appliance tags
const filterBySelectedApplianceTags = () => {
  let tempIds = [];
  result.innerHTML = "";
  console.log("idsDisplayedRecipe", idsDisplayedRecipe);
  console.log("selectedApplianceTags", selectedApplianceTags);
  console.log("selectedUstensilsTags", selectedUstensilsTags);

  recipes.forEach((recipe) => {
    for (let tag of selectedApplianceTags) {
      if (
        tag === recipe.appliance &&
        idsDisplayedRecipe.includes(recipe.id) &&
        !tempIds.includes(recipe.id)
      ) {
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
      }
    }
  });
  idsDisplayedRecipe = tempIds;
  console.log(idsDisplayedRecipe);
};

// function which filter recipes by selected ustensils tags
const filterBySelectedUstensilsTags = () => {
  let tempIds = [];
  result.innerHTML = "";
  console.log("idsDisplayedRecipe", idsDisplayedRecipe);
  console.log("selectedApplianceTags", selectedApplianceTags);
  console.log("selectedUstensilsTags", selectedUstensilsTags);

  recipes.forEach((recipe) => {
    let normalised = [];
    recipe.ustensils.forEach((elem) => {
      normalised.push(normalise(elem));
    });
    for (let tag of selectedUstensilsTags) {
      if (
        normalised.includes(tag) &&
        idsDisplayedRecipe.includes(recipe.id) &&
        !tempIds.includes(recipe.id)
      ) {
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
      }
    }
  });
  idsDisplayedRecipe = tempIds;
  console.log(idsDisplayedRecipe);
};

// function which conditions the update of recipes depending on the global input
const filterByGlobalInput = () => {
  if (searchInputGlobal.value === "") {
    idsDisplayedRecipe = [];
    console.log("ther's NO value in input global");
    recipes.forEach((recipe) => {
      createRecipeElem(recipe);
      idsDisplayedRecipe.push(recipe.id);
    });
  } else {
    console.log("ther's a value in input global");
    globalInputSearch();
  }
  console.log("idsDisplayedRecipe", idsDisplayedRecipe);
};

// function which creates selected tag's HTML and register event on each closing icon
const createSelectedElem = (selectedTag, parentElem) => {
  const liElem = document.createElement("li");
  liElem.classList.add("selected-tag");
  liElem.innerHTML += `${selectedTag}<i class="far fa-times-circle"></i>`;
  // remove empty spaces from the tag name so it becomes a valuable ID name
  selectedTag = selectedTag.replaceAll(" ", "-");
  liElem.setAttribute("id", `${selectedTag}`);

  parentElem.appendChild(liElem);

  const closeFiltred = document.querySelector(
    `li#${selectedTag} i.fa-times-circle`
  );

  // register click event on closing icon -> remove closed tag's HTML, re-fiter recipes and tag list
  closeFiltred.addEventListener("click", (e) => {
    // find the parent of the clicked icon
    const liTarget = e.target.closest("li");
    // remove the tag's HTML from the DOM tree
    liTarget.remove();
    // retrieve the text content from the tag
    let liTargetContent = e.target.closest("li").textContent;
    // check if the tag is ustensils/appliance tag
    if (selectedUstensilsTags.includes(liTargetContent)) {
      console.log("The closed tag is an ustensil tag");
      // find the index of the closed tag in the array of tags
      const ustensilsIndex = selectedUstensilsTags.indexOf(liTarget.id);
      // remove the targeted tag form the array
      selectedUstensilsTags.splice(ustensilsIndex, 1);
    } else {
      console.log("The closed tag is an appliance tag");
      const applianceIndex = selectedApplianceTags.indexOf(liTarget.id);
      selectedApplianceTags.splice(applianceIndex, 1);
    }
    console.log(selectedUstensilsTags);
    console.log(selectedApplianceTags);

    // update recipes
    if (selectedApplianceTags.length !== 0) {
      filterByGlobalInput();
      filterBySelectedApplianceTags();
    }
    if (selectedUstensilsTags.length !== 0) {
      filterBySelectedUstensilsTags();
    }
    if (
      selectedUstensilsTags.length === 0 &&
      selectedApplianceTags.length === 0
    ) {
      filterByGlobalInput();
    }

    // update tag list
    createLiTags(extractIncludedTags("appliance"), divListAppliance);
    createLiTags(extractIncludedTags("ustensils"), divListUstensils);
  });
};

// register click event on the appliance search input -> display appliance tags (included in currently displayed recipes)
inputAppliance.addEventListener("click", (e) => {
  createLiTags(extractIncludedTags("appliance"), divListAppliance);
});

// register click event on the ustensils search input -> display ustensils tags (included in currently displayed recipes)
inputUstensil.addEventListener("click", (e) => {
  createLiTags(extractIncludedTags("ustensils"), divListUstensils);
});

// register click event on the ingredients search input -> display ingredients tags (included in currently displayed recipes)
inputIngredient.addEventListener("click", (e) => {
  createLiTags(extractIncludedTags("ingredients"), divListIngredients);
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
