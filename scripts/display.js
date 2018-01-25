'use strict';


/*global api,localModel*/

/* display*/
const display = function () {

  const listenForNewBookmarkSubmit = () => {
    $('.add-bookmark-form').on('submit', (event) => {
      event.preventDefault();
      const title =  $('.add-bookmark-title').val();
      $('.add-bookmark-title').val('');
      const desc =  $('.add-bookmark-description').val();
      $('.add-bookmark-description').val('');
      const url =  $('.add-bookmark-url').val();
      $('.add-bookmark-url').val('');
      const rating =  $('.add-bookmark-rating').val();
      $('.add-bookmark-rating').val('');
      // Send to Server
      api.createNewBookmarkOnServer(title,desc,rating,url, (response) => {
        localModel.addSingleBookmarkToModel(response);
        pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));

      });

    });

  };


  const initiateApp = () => {
    //event listeners
    listenForNewBookmarkSubmit();
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
    listenForNewBookmarkSubmit
  };

}();