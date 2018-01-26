'use strict';


const localModel = function () {

  const addSingleBookmarkToModel = function (bookmark) {
    this.bookmarks.push({
      id:bookmark.id,
      title:bookmark.title,
      url:bookmark.url,
      desc:bookmark.desc,
      rating:bookmark.rating,
      isPreviewing:false,
      isEditingTitle:false
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
        isPreviewing:false,
        isEditingTitle:false
      });
    });
  };

  const deleteBookmarkFromLocalModel = function(itemId) {
    this.bookmarks = this.bookmarks.filter((bookmark) => {
      return bookmark.id !== itemId;
    });
  };

  const filterItemsByRating = (rating) => {
    let filteredBookmarkList = localModel.bookmarks.filter((bookmark) => {
      return bookmark.rating >= parseInt(rating);
    });
    return filteredBookmarkList;
  };

  const bookmarks = [];

  const searchTerm = null;
  

  return {
    bookmarks,
    addSingleBookmarkToModel,
    isPreviewing:false,
    filterRating:0,
    pullAllBookmarksIntoModel,
    deleteBookmarkFromLocalModel,
    filterItemsByRating,
    searchTerm
  };

}();