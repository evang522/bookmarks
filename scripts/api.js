'use strict';

/*global api*/

const api = function () {

  const baseURL = 'https://thinkful-list-api.herokuapp.com/evang522/bookmarks';
  

  const createNewBookmarkOnServer = (title,desc,rating,url,callback) => {
    const updateQueryObj = JSON.stringify({
      title:title,
      url:url,
      desc:desc,
      rating:rating,
    });

    console.log(updateQueryObj);

    $.ajax({
      url:baseURL,
      contentType:'application/json',
      method:'POST',
      data:updateQueryObj,
      success:callback
    });
  };


  const fetchFromServer = (callback) => {
    $.getJSON(baseURL,(callback));
  };

  return {
    fetchFromServer,
    createNewBookmarkOnServer
  };

}();