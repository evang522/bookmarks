'use strict';


/*global api,localModel*/

/* display*/
const display = function () {

  const listenForNewBookmarkSubmit = () => {
    $('.add-bookmark-form').on('submit', (event) => {
      event.preventDefault();
      let bookmark = {};
      try{
        $(event.currentTarget)
          .find('.add-bookmark-input')
          .each((index,item) => {
            let key = $(item).attr('name');
            let value = $(item).val();
          
            validate(key,value);
            bookmark[key]= value;        
          });
      } catch(e) {
        console.log(e.message);
        return;
      }

      $('.add-bookmark-input').each((x,y) => {
        $(y).val('');
      });
      // Send to Server
      api.createNewBookmarkOnServer(bookmark, (response) => {
        localModel.addSingleBookmarkToModel(response);
        pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
      });

    });

  };


  const schema = { 
    title : 
    {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      value: '' },
    url :
      {type: 'url',
        minLength: 1,
        maxLength: 100,
        value: '' }
  };

  const validate = (key,value) => {
    if (schema[key] == undefined) return true;
    if (value.length < schema[key].minLength) throw new Error(`invalid Minimum Length: ${key}`);
    if (value.length >= schema[key].maxLength) throw new Error(`invalid Max length: ${key}`);
    // if (schema[key].type === 'url')  {
    //   return value.indexOf('http') !== 0;
    // }

    return true;
  };


  const listenForFilterByRating = () => {
    $('.bookmark-rating-filter-select').on('change', (event) => {
      let userInput = $(event.target).val();
      localModel.filterRating = userInput;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
    });
  };

  const listenForSearch = () => {
    $('.bookmark-search-form').on('submit', (event) => {
      event.preventDefault();
      localModel.searchTerm = $('.bookmark-search-input').val();
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
    });
  };

  const listenForPreviewBookmark = () => {

    $('.bookmark-container').on('click','.bookmark', (event) => {
      let clickedItemId = $(event.target).closest('li').attr('data-item-id');
      localModel.isPreviewing = true;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,clickedItemId));
    });
  };


  const listenForClosePreview = () => {
    $('.bookmark-container').on('click','.bookmark-preview-close',(event) => {
      localModel.isPreviewing = false;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
    });
  };


  const listenForDeleteBookmark = () => {
    $('.bookmark-container').on('click', '.delete-bookmark-button', (event) => {
      // console.log('delete');
      let itemId = $(event.target).closest('section').attr('data-item-id');
      api.deleteBookmarkFromServer(itemId,()=> {
        localModel.deleteBookmarkFromLocalModel(itemId);
        localModel.isPreviewing = false;
        pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
      });

    });
  };

  const listenForShowAll = () => {
    $('.reset-all-button').on('click',(event)=>{
      localModel.searchTerm = null;
      localModel.filterRating = 0;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
      $('.bookmark-rating-filter-select').val(1);
      $('.bookmark-search-input').val('');
    });
  };

  const initiateApp = () => {
    //event listeners
    api.fetchFromServer((data) => {
      localModel.pullAllBookmarksIntoModel(data);
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks));
    });

    listenForClosePreview();
    listenForPreviewBookmark();
    listenForNewBookmarkSubmit();
    listenForDeleteBookmark();
    listenForFilterByRating();
    listenForSearch();
    listenForShowAll();
  };


  const generateHTMLStringFromLocalBookmarks = (localBookmarks,id) => {
    let domString = '';


    let filteredArr = localBookmarks;

    if (localModel.filterRating > 0) {
      filteredArr = localModel.filterItemsByRating(localModel.filterRating);
      filteredArr.forEach((item) => {
        domString += `
        <li class='bookmark' data-item-id='${item.id}'>
        <h3 class='bookmark-title center'>${item.title}</h3>
        <p class='center'>Rating:${item.rating}</p>
        </li>`;
      });
      console.log('ran rating filter');
    } 

    if (localModel.searchTerm) {
      let searchfilteredArr = filteredArr.filter((bookmark)=> {
        return bookmark.title.toLowerCase().includes(localModel.searchTerm.toLowerCase());
      });
      domString = '';
      searchfilteredArr.forEach((item) => {
        domString += `
        <li class='bookmark' data-item-id='${item.id}'>
        <h3 class='bookmark-title center'>${item.title}</h3>
        <p class='center'>Rating:${item.rating}</p>
        </li>`;
      });
      console.log('ran searchTerm Condition');
    }
    if (!localModel.searchTerm && localModel.filterRating === 0) {
      localBookmarks.forEach((item) => {
        domString += `
      <li class='bookmark' data-item-id='${item.id}'>
      <h3 class='bookmark-title center'>${item.title}</h3>
      <p class='center'>Rating:${item.rating}</p>
      </li>`;
      });
      console.log('ran conditionless');
    }

    if (localModel.isPreviewing) {
      let pvwBookmark = localModel.bookmarks.find((bookmark) =>{
        return bookmark.id === id;
      });
      domString += `
      <section role='region' class='static-view-item-container' data-item-id = '${pvwBookmark.id}'>
      <h2 class='zoom-bookmark-title'>${pvwBookmark.title}</h2>
      <p class='zoom-bookmark-description'>${pvwBookmark.desc}</p>
      <p class='zoom-bookmark-rating'>Rating:${pvwBookmark.rating}</p>
      <p class='zoom-bookmark-url'>${pvwBookmark.url}</p>
      <a class='bookmark' href='${pvwBookmark.url}' target='_blank'>Click here to launch site!</a>
      <button class='delete-bookmark-button'>Delete Item</button>
      <button class='bookmark-preview-close'>Close Preview</button>
    </section>`;
    }

    return domString;
  };

  const pushToDom = (domString) => {
    $('.bookmark-container').html(domString);
  };



  return {
    initiateApp,
    generateHTMLStringFromLocalBookmarks,
    pushToDom,
    listenForNewBookmarkSubmit,
    validate
  };

}();