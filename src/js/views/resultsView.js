import View from "./View";
import icons from 'url:../../img/icons.svg'
class ResultsView extends View{
    _parentElement=document.querySelector(".results")
    _erroMessage='No Recipes Found,Try Again!.'
    _message='Successful';
    _generateMarkup(){
        return this._data.map((data1)=>{
            return this._generateMarkupPreview(data1)
        }).join("")

}
    _generateMarkupPreview(result){
      const id=window.location.hash.slice(1)

        return `
        <li class="preview">
        <a class="preview__link ${result.id===id?"preview__link--active":""}" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.published}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
        
        `;
    }
}
export default new ResultsView()