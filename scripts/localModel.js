'use strict';


const localModel = function () {

  const addSingleBookmarkToModel = function (bookmark) {
    this.bookmarks.push({
      id:bookmark.id,
      title:bookmark.title,
      url:bookmark.url,
      desc:bookmark.desc,
      rating:bookmark.rating,
      isPreviewing:false
    });   
  };

  const pullAllBookmarksIntoModel = function (bookmarksArrayFromServer) {
    // This will never be used except for on initiating app.
    bookmarksArrayFromServer.forEach((item) => {
      this.bookmarks.push({
        id:item.id,
        title:item.title,
        url:item.url,
        desc:item.desc,
        rating:item.rating,
        isPreviewing:false
      });
    });
  };

  const bookmarks = [];


  return {
    bookmarks,
    addSingleBookmarkToModel,
    isPreviewing:false,
    filterRating:0,
    pullAllBookmarksIntoModel
    
  };

}();