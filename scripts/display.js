'use strict';

/* display*/
const display = function () {




  const initiateApp = () => {
    //event listeners
  };


  const generateHTMLStringFromLocalBookmarks = (localBookmarks) => {
    let domString = '';
    localBookmarks.forEach((item) => {
      domString += `
      <li class='bookmark'>
      <h3 class='bookmark-title center'>${item.title}</h3>
      <p class='center'>Rating:${item.rating}</p>
      </li>`;
    });
    return domString;
  };

  const pushToDom = (domString) => {
    $('.bookmark-container').html(domString)
  };



  return {
    initiateApp,
    generateHTMLStringFromLocalBookmarks,
    pushToDom,
  };

}();