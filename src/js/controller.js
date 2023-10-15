const recipeContainer = document.querySelector('.recipe');
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if(module.hot){
  module.hot.accept()
}


//demo recipe - http://localhost:1234/#5ed6604591c37cdc054bc886
const controlRecipe=async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return
    recipeView.renderSpinner(recipeContainer)
    
    resultsView.update(model.getSearchResultsPage())

    await model.loadRecipe(id)
    console.log("loaded")
    const {recipe}=model.state

    //rendering data
    recipeView.render(model.state.recipe)
    bookmarksView.update(model.state.bookmarks)
    // controlServings()
}
  catch(err){
    // alert(err)
    recipeView.renderError()
  }

}
const controlSearchResults=async function(){
  try{
  const query=searchView.getQuery()
   if(!query) return;
   resultsView.renderSpinner()
   searchView.clearInput()
   await model.loadSearchResults(query)
   console.log(model.state.search.results)
   resultsView.render(model.getSearchResultsPage())
    paginationView.render(model.state.search)
  }
  catch(err){
    console.log(err)
  }
}
const controlPagination = function(page){
  console.log("page contr",page)
  resultsView.render(model.getSearchResultsPage(page))
  paginationView.render(model.state.search)
}
const controlServings = function(serving){
  model.updateServings(serving)
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}
const controlAddBookMark=function(){
  if(!model.state.recipe.bookmarked){
    model.addBookMark(model.state.recipe)
    }
  else{
    model.deleteBookmark(model.state.recipe.id)
  }
  recipeView.update(model.state.recipe)
  bookmarksView.render(model.state.bookmarks)
}
const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
}
const controlAddRecipe=async function(newRecipe){
  console.log(newRecipe)
  try{
    addRecipeView.renderSpinner()
 await model.uploadRecipe(newRecipe)
 console.log(model.state.recipe)
 recipeView.render(model.state.recipe)
 addRecipeView.renderMessage()
 bookmarksView.render(model.state.bookmarks)
 window.history.pushState(null,'',`#${model.state.recipe.id}`)
 setTimeout(()=>{
  addRecipeView.toggleWindow()
 },2500)
  }catch(err){
    addRecipeView.renderError('Wrong ingrdient format! Please use the correct format!')
  }
}
controlSearchResults()
const init=function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdaterServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerBookmark(controlAddBookMark)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
