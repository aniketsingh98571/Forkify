import { API_URL } from "./config"
import { getJSON,sendJSON } from "./helpers"
export const state = {
    recipe:{},
    search:{
        query:"",
        results:[],
        page:1,
        resultsPerPage:10
    },
    bookmarks:[]
}
export const loadRecipe=async(id)=>{
    try{
      const data=await getJSON(`${API_URL}/${id}`)
        const {recipe}=data.data
            state.recipe = {
            id:recipe.id,
            title:recipe.title,
            publisher:recipe.publisher,
            sourceUrl:recipe.source_url,
            image:recipe.image_url,
            servings:recipe.servings,
            cookingTime:recipe.cooking_time,
            ingredients:recipe.ingredients
            }
            if(state.bookmarks.some(bookmark=>bookmark.id===id))
                state.recipe.bookmarked=true
            else
                state.recipe.bookmarked=false

    }
    catch(err){
        // alert(err)
        throw err
    }
}
export const loadSearchResults=async function(query){
    try{
        state.search.query=query
        const data= await getJSON(`${API_URL}?search=${query}`)
        console.log(data)
    state.search.results= data.data.recipes.map((recipe)=>{
            return {
                id:recipe.id,
                title:recipe.title,
                publisher:recipe.publisher,
                image:recipe.image_url,
            }
        })
        console.log(state)
        state.search.page=1
    }
   
    catch(err){
        throw err
    }
}
export const getSearchResultsPage=function(page=state.search.page){
    state.search.page=page
    const start=(page-1)*state.search.resultsPerPage
    const end=page*state.search.resultsPerPage
    return state.search.results.slice(start,end)
}
export const updateServings=function(servings){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity = ing.quantity*servings/state.recipe.servings
    })
    state.recipe.servings=servings
}
export const addBookMark=function(recipe){
 state.bookmarks.push(recipe)
 if(recipe.id===state.recipe.id){
    state.recipe.bookmarked=true
 }
 persistBookmarks()
}
export const persistBookmarks=function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
}
export const deleteBookmark=function(id){
    const index=state.bookmarks.findIndex(el=>el.id===id)
    state.bookmarks.splice(index,1)
    if(id===state.recipe.id){
        state.recipe.bookmarked=false
     }
     persistBookmarks()
}
const createRecipeObject=function(data){
    const {recipe}=data.data
    console.log(recipe)
    return  {
        id:recipe.id,
        title:recipe.title,
        publisher:recipe.publisher,
        sourceUrl:recipe.source_url,
        image:recipe.image_url,
        servings:recipe.servings,
        cookingTime:recipe.cooking_time,
        ingredients:recipe.ingredients,
        ...(recipe.key&&{key:recipe.key})
        }
}
export const uploadRecipe=async function(data){
    try{
    const ingredients=Object.entries(data).filter((data1)=>{
        console.log(data1)
        return data1[0].startsWith('ingredient')&&data1[1]!==''
    }).map((ing)=>{

      const ingArr= ing[1].replaceAll(' ','').split(',')
       if(ingArr.length!==3){
        throw err
       }
       const [quantity,unit,description]=ingArr 
      return {quantity:quantity?+quantity:null,unit,description}
    })
    console.log(ingredients)
    const recipe={
        title:data.title,
        source_url:data.sourceUrl,
        image_url:data.image,
        publisher:data.publisher,
        cooking_time:+data.cookingTime,
        servings:+data.servings,
        ingredients
    }
    console.log(recipe)
  const response= await sendJSON(`${API_URL}?key=37ec37d5-c6e0-47f7-854e-782cda9e31aa`,recipe)
  console.log(response)
  state.recipe=createRecipeObject(response)
  addBookMark(state.recipe)
}catch(err){
    throw err
}
}
const init=function(){
const storage=localStorage.getItem("bookmarks")
if(storage){
    state.bookmarks=JSON.parse(storage)
}
}
init()
console.log(state.bookmarks)