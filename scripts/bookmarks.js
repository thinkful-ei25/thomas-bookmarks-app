'use strict';

// eslint-disable-next-line no-unused-vars

const bookmarks = (function(){

  const addItem = function(items) {
    this.items.unshift(items);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const findAndUpdate = function(id, newData){
    let item = this.items.find((item) => id === item.id);
    item = Object.assign(item, newData);
    // console.log(item);
  };

  const toggleAddingFilter = function() {
    this.adding = !this.adding;
  };

  let error = null;

  return {
    items: [],
    adding: false,
    hideCheckedItems: false,
    filterByValue: 0,

    addItem,
    findAndDelete,
    findAndUpdate,
    toggleAddingFilter,
    error,
  };

}());