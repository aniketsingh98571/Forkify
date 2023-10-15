import icons from 'url:../../img/icons.svg'
export default class View{
    _data;
    render(data){
        if(!data|| (Array.isArray(data)&&data.length===0)) return this.renderError()
        this._data=data
        const markUp=this._generateMarkup()
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin',markUp)
    }
   _clear(){
    this._parentElement.innerHTML=''
   }
   renderSpinner = function(){
    const markUp = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `
    this._parentElement.innerHTML=''
    this._parentElement.insertAdjacentHTML('afterbegin',markUp)
  }
  renderError(message=this._erroMessage){
    const markUp = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>{${message}}</p>
  </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin',markUp)
  }
  renderMessage(message=this._message){
    const markUp = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>{${message}}</p>
  </div>
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin',markUp)
  }
  update(data){
    this._data=data
    const newMarkUp=this._generateMarkup()
    //creating a mini replica of updated dom here so that we can compare it with previous dom
    const newDOM=document.createRange().createContextualFragment(newMarkUp)
    const newElements=Array.from(newDOM.querySelectorAll('*'))
    // console.log(newElements)
    
    //selecting all the elements that are available on current dom
    const currentElement=Array.from(this._parentElement.querySelectorAll('*')) 
 
    //comparing new dom with old dom and rendering only the changed fields
    newElements.forEach((newEl,i)=>{
      const currEl=currentElement[i]
      console.log(newEl.isEqualNode(currEl))
      if(!newEl.isEqualNode(currEl)&&newEl?.firstChild?.nodeValue.trim()!==''){
        currEl.textContent=newEl.textContent
      }

      //updating the attributes also
      if(!newEl.isEqualNode(currEl)){
        console.log(newEl.attributes)
        Array.from(newEl.attributes).forEach((attr)=>{
          currEl.setAttribute(attr.name,attr.value)
        })
      }
    })
  }
}