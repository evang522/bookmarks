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


  const listenForPreviewBookmark = () => {

    $('.bookmark-container').on('click','.bookmark', (event) => {
      let clickedItemId = $(event.target).closest('li').attr('data-item-id');
      localModel.isPreviewing = true;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,clickedItemId));
    });

  };

  const initiateApp = () => {
    //event listeners
    api.fetchFromServer((data) => {
      localModel.pullAllBookmarksIntoModel(data);
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
    });
    
    listenForPreviewBookmark();
    listenForNewBookmarkSubmit();
  };


  const generateHTMLStringFromLocalBookmarks = (localBookmarks,id) => {
    let domString = '';
    if (localModel.isPreviewing) {
      let pvwBookmark = localModel.bookmarks.find((bookmark) =>{
        return bookmark.id === id;
      });
      domString += `
      <section role='region' class='static-view-item-container'>
      <h2 class='zoom-bookmark-title'>${pvwBookmark.title}</h2>
      <p class='zoom-bookmark-description'>${pvwBookmark.desc}</p>
      <p class='zoom-bookmark-rating'>Rating:${pvwBookmark.rating}</p>
      <p class='zoom-bookmark-url'>${pvwBookmark.url}</p>
      <button class='bookmark-item-delete'>Delete Item</button>
    </section>`;
    }
    localBookmarks.forEach((item) => {
      domString += `
      <li class='bookmark' data-item-id='${item.id}'>
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