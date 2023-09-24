// import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { async } from 'regenerator-runtime';
import searchView from './views/searchView.js';
import View from './views/view.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksVeiw.js';
import bookmarksVeiw from './views/bookmarksVeiw.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// console.log(icons);
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// activiate modile.hot to stop the reloading page
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2) load data
    await model.loadRecipe(id);

    // 3) render data
    // const recipeView = new RecipeView(model.state.recipe)
    // more clean
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Grt search query
    const query = searchView.getQuery();
    if (!query) return;
    //--->commented
    resultsView.renderSpinner();

    // 2) Load Search results
    await model.loadSearchResults(query);

    // 3)render results
    // console.log(model.state.search.results);
    // resultsView.render(model.getSearchResultsPage()); //default is 1
    resultsView.render(model.getSearchResultsPage()); //default is 1

    // 4) Render intial pagination buttons
    paginationView.render(model.state.search);
    // View.update(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  // 3)render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW intial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Updata the recipe servings
  model.updateServings(newServings);
  // Update the recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) update Bookmark
  recipeView.update(model.state.recipe);
  // 3) Render BookMark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // upload spinner
    recipeView.renderSpinner();
    // upload the new recipe
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookMark view
    bookmarksVeiw.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🥳', err);
    addRecipeView.renderError(err.message);
  }
  location.reload();
};
const hello = function () {
  console.log('hello, world');
};
const init = function () {
  bookmarksVeiw.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookmarks);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  hello();
};
init();
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
