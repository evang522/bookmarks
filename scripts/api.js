'use strict';

/*global api*/

const api = function () {

  const baseURL = 'https://thinkful-list-api.herokuapp.com/evang522/bookmarks';
  

  const fetchFromServer = (callback) => {
    $.getJSON(baseURL,(callback));
  };

  return {
    fetchFromServer,
  };

}();