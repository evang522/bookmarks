'use strict';

/*global api*/

const api = function () {

  const baseURL = 'https://thinkful-list-api.herokuapp.com/evang522/bookmarks';
  

  const createNewBookmarkOnServer = (bookmark,callback) => {
    const QueryObj = JSON.stringify(bookmark);

    console.log(QueryObj);

    $.ajax({
      url:baseURL,
      contentType:'application/json',
      method:'POST',
      data:QueryObj,
      success:callback
    });
  };


  const fetchFromServer = (callback) => {
    $.getJSON(baseURL,(callback));
  };

  const deleteBookmarkFromServer = (itemId,callback) => {
    $.ajax({
      url:`${baseURL}/${itemId}`,
      method:'DELETE',
      success:callback});
  };

  const updateItemOnServer = (itemId,updateObj,callback) => {
    const updateQueryObj = JSON.stringify(updateObj);
    console.log(updateQueryObj);
    $.ajax({
      url:`${baseURL}/${itemId}`,
      method:'PATCH',
      contentType:'application/json',
      data:updateQueryObj,
      success:callback});
  };

  return {
    fetchFromServer,
    createNewBookmarkOnServer,
    deleteBookmarkFromServer,
    updateItemOnServer
  };

}();