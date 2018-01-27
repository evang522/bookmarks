'use strict';


/*global api,localModel*/

/* display*/
const display = function () {



  // FORM VALIDATION-------------------------------------------------------------------------------->
  const schema = { 
    title : 
    {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      value: '' 
    },
    url :
    {
      type: 'url',
      minLength: 1,
      maxLength: 100,
      value: '' 
    },
    desc : 
    {
      type:'desc',
      minLength:3,
      maxLength:200,
    },
    rating:
    {
      type:'rating',
    }
  };

  const validate = (key,value) => {
    if (schema[key] == undefined) return true;
    if (value.length < schema[key].minLength) throw new Error(`Your ${key} is invalid!`);
    if (value.length >= schema[key].maxLength) throw new Error(`Your ${key} is invalid!`);
    if (schema[key].type === 'url')  {
      // console.log(value);
      if (value.indexOf('http') !== 0) {
        throw new Error(`Your ${key} is invalid!`);
      }
    }
    if (schema[key].type === 'rating' && value > 5) {
      console.log(schema[key].type);
      throw new Error('Ratings may only be 5 stars or below');
    }

    return true;
  };


  // Event Listeners-------------------------------------------------------------------------------->

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
        alert(e.message);
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


  const listenForInitiateTitleEdit = () => {
    $('.bookmark-container').on('click','.zoom-bookmark-title', (event) => {
      let itemId = $(event.target).closest('section').attr('data-item-id');
      let itemEdited = localModel.bookmarks.find((bookmark) => {
        return bookmark.id === itemId;
      });
      itemEdited.isEditingTitle = true;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,itemId));
      $('.zoom-bookmark-title-edit').focus();
    });
  };


  const listenForConfirmTitleEdit = () => {
    $('.bookmark-container').on('submit','.zoom-bookmark-title-edit-form', (event) => {
      console.log('title edit confirmed');
      event.preventDefault();
      let newTitle = $('.zoom-bookmark-title-edit').val();
      let itemId = $(event.target).closest('.static-view-item-container').attr('data-item-id');
      let updateObj = {
        title:newTitle
      };
      
      // send to server
      api.updateItemOnServer(itemId,updateObj,() => {
        console.log('title update sent to server');
        const localBookmarkToUpdate = localModel.bookmarks.find((bookmark)=> {
          return bookmark.id === itemId;
        });
        localBookmarkToUpdate.title = newTitle;
        localBookmarkToUpdate.isEditingTitle = false;
        pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,itemId));

      });

    });
  };


  const listenForInitiateDescEdit = () => {
    $('.bookmark-container').on('click','.zoom-bookmark-description', (event) => {
      let itemId = $(event.target).closest('section').attr('data-item-id');
      let itemEdited = localModel.bookmarks.find((bookmark) => {
        return bookmark.id === itemId;
      });
      itemEdited.isEditingDesc = true;
      pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,itemId));
      $('.zoom-bookmark-description').focus();
    });
  };


  const listenForConfirmDescEdit = () => {
    $('.bookmark-container').on('keydown', '.zoom-bookmark-description-edit', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        let newDescription = $('.zoom-bookmark-description-edit').val();
        let itemId = $(event.target).closest('.static-view-item-container').attr('data-item-id');
        let updateObj = {
          desc:newDescription
        };
      
        // send to server
        api.updateItemOnServer(itemId,updateObj,() => {
          const localBookmarkToUpdate = localModel.bookmarks.find((bookmark)=> {
            return bookmark.id === itemId;
          });
          localBookmarkToUpdate.desc = newDescription;
          localBookmarkToUpdate.isEditingDesc = false;
          pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,itemId));
        });
      }
    });
  };

  const listenforRatingEdit = () => {
    $('.bookmark-container').on('change','.set-new-rating-select',(event) => {
      let newRating = $('.set-new-rating-select').val();
      let itemId = $(event.target).closest('section').attr('data-item-id');
      let updateObj = {
        rating:newRating
      };
      api.updateItemOnServer(itemId,updateObj, () => {
        let localRating = localModel.bookmarks.find(bookmark => bookmark.id === itemId);
        localRating.rating = newRating;
        pushToDom(generateHTMLStringFromLocalBookmarks(localModel.bookmarks,itemId));
      });
    });
  };

  // DOM MANIPULATION-------------------------------------------------------------------------------->



  const generateStars = (rating) => {
    let star = '<p>&#9734;</p>';
    let starRatingString = '<div class=\'starCont\'>';
    for (let i=1;i<=rating;i++) {
      starRatingString+= star;
    }
    starRatingString += '</div>';
    return starRatingString;
  };


  const generateHTMLStringFromLocalBookmarks = (localBookmarks,id) => {

    // This function takes in the local array of bookmarks and generates an HTML string based on certain conditions.

    // Declare empty string which html will be appended to.
    let domString = '';


    let filteredArr = localBookmarks;

    if (localModel.filterRating > 0) {
      filteredArr = localModel.filterItemsByRating(localModel.filterRating);
      filteredArr.forEach((item) => {
        domString += `
        <li class='bookmark' data-item-id='${item.id}'>
        <h3 class='bookmark-title center'>${item.title}</h3>
        <p class='center'>${display.generateStars(item.rating)}</p>
        </li>`;
      });
      console.log('ran rating filter');
    } 

    if (localModel.searchTerm) {
      let searchfilteredArr = filteredArr.filter((bookmark)=> {
        return (bookmark.title.toLowerCase().includes(localModel.searchTerm.toLowerCase()) || bookmark.desc.toLowerCase().includes(localModel.searchTerm.toLowerCase()));
      });
      domString = '';
      searchfilteredArr.forEach((item) => {
        domString += `
        <li class='bookmark' data-item-id='${item.id}'>
        <h3 class='bookmark-title center'>${item.title}</h3>
        <p class='center'>${display.generateStars(item.rating)}</p>
        </li>`;
      });
      // console.log('ran searchTerm Condition');
    }


    if (!localModel.searchTerm && localModel.filterRating === 0) {
      localBookmarks.forEach((item) => {
        domString += `
      <li class='bookmark' data-item-id='${item.id}'>
      <h3 class='bookmark-title center'>${item.title}</h3>
      <p class='center'>${display.generateStars(item.rating)}</p>
      </li>`;
      });
      // console.log('ran conditionless');
    }



    if (localModel.isPreviewing) {
      let pvwBookmark = localModel.bookmarks.find((bookmark) =>{
        return bookmark.id === id;
      });
      // console.log(pvwBookmark);
      let editingTitleHTML = `<form class="zoom-bookmark-title-edit-form"><input class="zoom-bookmark-title-edit centerBlock" value = '${pvwBookmark.title}'></form>`;
      let notEditingTitleHTML = `<h2 class='zoom-bookmark-title center small-space-below'>${pvwBookmark.title}</h2>`;
      let editingDescHTML = `<textarea class='zoom-bookmark-description-edit centerBlock'>${pvwBookmark.desc}</textarea>`;
      let notEditingDescHTML = `<p class='zoom-bookmark-description center'>${pvwBookmark.desc}</p>`;
      domString += `
      <section role='region' class='static-view-item-container' data-item-id = '${pvwBookmark.id}'>
      ${pvwBookmark.isEditingTitle ? editingTitleHTML : notEditingTitleHTML}
      ${pvwBookmark.isEditingDesc ? editingDescHTML : notEditingDescHTML}
      <div class='zoom-rating-cont'>
      <p>Rating:</p>
      <select class='set-new-rating-select'>
        <option selected disabled value='${pvwBookmark.rating}'> Current: ${pvwBookmark.rating}</option>
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
      </select>
      </div>
      <p class='zoom-bookmark-url small-space-above center small-space-below'>URL: ${pvwBookmark.url}</p>
      <form action='${pvwBookmark.url}' target='_blank'>
        <button class='wider-button'>Click here to launch site!</button>
      </form>
      <div class='static-button-div'>
        <button class='delete-bookmark-button'>Delete Item</button>
        <button class='bookmark-preview-close'>Close</button>

      </div>
    </section>`;
    }

    return domString;
  };

  const pushToDom = (domString) => {
    $('.bookmark-container').html(domString);
  };


  // Start App on Load-------------------------------------------------------------------------------->
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
    listenForInitiateTitleEdit();
    listenForConfirmTitleEdit();
    listenForConfirmDescEdit();
    listenForInitiateDescEdit();
    listenforRatingEdit();
  };



  return {
    initiateApp,
    generateHTMLStringFromLocalBookmarks,
    pushToDom,
    listenForNewBookmarkSubmit,
    validate,
    generateStars
  };

}();