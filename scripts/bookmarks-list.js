'use strict';
/* global bookmarks $ api */
// eslint-disable-next-line no-unused-vars

const bookmarkList = (function() {

  function generateBookmarkElement(bookmark) {
    return `
      <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-container">
          <div class="bookmark-title-container"><span class="bookmark-title-vert-align">${bookmark.title}</span>
              <label class="switch js-bookmark-switch">
                <input type="checkbox">
                <span class="slider round"></span>
              </label>
            <div class=""><span>${bookmark.rating}/5 stars</span></div>
          </div>
          <div class="bookmark-description-container js-bookmark-description-container">
            <div class="bookmark-user-description-input">${bookmark.desc}</div>
            <div class="bookmark-visit-site-delete-btns">
                <button type="button" class="bookmark-visit-site-btn js-bookmark-visit-site-btn" onclick=" window.open('${bookmark.url}','_blank')">Visit Site</button>
                <button type="button" class="bookmark-delete-btn js-bookmark-delete-btn">Delete</button>
                <button type="button" class="bookmark-edit-btn js-bookmark-edit-btn">Edit</button>
            </div>
          </div>
        </div>
      </li>
    `;
  }

  function generateAddingBookmarkElement() {
    return `

        <h2>Add New Bookmark</h2>
        <input type="text" name="bookmark-title-entry" class="js-bookmark-title-entry bookmark-title-entry" placeholder="Bookmark Title">
        <input type="text" name="bookmark-url-entry" class="js-bookmark-url-entry bookmark-url-entry" placeholder="Bookmark URL">
        
        <textarea rows="8" cols="50" maxlength="300" name="bookmark-user-description-entry" form="bookmark-description-entry" class="js-bookmark-user-description-entry bookmark-user-description-entry" placeholder="Enter bookmark description here..."></textarea>
        
        <div class="select-rating-radio-btns">
          Select a rating:<br><br>
          <input type="radio" name="user-star-rating" class="five-stars-radio" value="5"> 5 stars &nbsp;<span>★★★★★</span><br>
          <input type="radio" name="user-star-rating" class="four-stars-radio" value="4"> 4 stars &nbsp;<span>★★★★☆</span><br>
          <input type="radio" name="user-star-rating" class="three-stars-radio" value="3"> 3 stars &nbsp;★★★☆☆</span><br>
          <input type="radio" name="user-star-rating" class="two-stars-radio" value="2"> 2 stars &nbsp;<span>★★☆☆☆</span><br>
          <input type="radio" name="user-star-rating" class="one-stars-radio" value="1"> 1 star &nbsp;&nbsp;&nbsp;<span>★☆☆☆☆</span><br>
        </div>  
        
        <div> 
          <button type="submit">Create New Bookmark</button>
        </div>

    `;
  }

  // function generateAddBookmarkAndMinRating() {
  //   return `
  //   <div class="add-bookmark js-add-bookmark">
  //   <button class="add-bookmark-btn js-add-bookmark-btn">
  //     <span class="bookmark-button-label">Add Bookmark</span>
  //   </button>
  // </div>
  
  // <div class="dropdown">
  //   <button class="dropbtn">Minimum Rating</button>
  //   <div class="dropdown-content">
  //     <a href="#">5 Stars &nbsp;<span>★★★★★</span></a>
  //     <a href="#">4 Stars &nbsp;<span>★★★★☆</span></a>
  //     <a href="#">3 Stars &nbsp;<span>★★★☆☆</span></a>
  //     <a href="#">2 Stars &nbsp;<span>★★☆☆☆</span></a>
  //     <a href="#">1 Star &nbsp;&nbsp;&nbsp;<span>★☆☆☆☆</span></a>
  //   </div>
  // </div>
  //   `;
  // }

  function generateBookmarkString(bookmarkList) {
    const bookmarkItemList = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarkItemList.join('');
  }


  function render() {
    let bookmark = bookmarks.items;
    console.log('`render` ran');

    if (bookmarks.adding === true) {
      const bookmarkAddingString = generateAddingBookmarkElement();
      $('.bookmark-title-url-entry-form').html(bookmarkAddingString);
    }
    
    // if (bookmarks.adding === false) {
    //   const bookmarkAddButton = generateAddBookmarkAndMinRating();
    //   $('.js-adding-state').html(bookmarkAddButton);
    // }
    // const bookmarkAddingState = generateAddingBookmarkElement();
    // $('.js-adding-state').html(bookmarkAddingState);
    // console.log(`bookmarkAddingState 1 ${bookmarks.adding}`);

    if (bookmarks.filterByValue <= 5) {
      bookmark = bookmarks.items.filter(bookmark => bookmark.rating >= bookmarks.filterByValue);
    }

    const bookmarkListString = generateBookmarkString(bookmark);
    // insert HTML into the DOM in the right place <ul></ul>
    $('.js-bookmark-list').html(bookmarkListString);
    // console.log(bookmarks);
  }

  function handleAddBookmark() {
    $('.js-add-bookmark').on('click', '.js-add-bookmark-btn', event => {
      event.preventDefault();
      console.log(`handleAddBookmark test 1 ${bookmarks.adding}`);
      bookmarks.toggleAddingFilter();
      // bookmarks.adding = true;
      console.log(`handleAddBookmark test 2 ${bookmarks.adding}`);
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-create-bookmark-form').submit(function(event) {
      event.preventDefault();

      //
      // test codes
      console.log(`handleNewBookmarkSubmit test 1 ${bookmarks.adding}`);
      // set adding to false to return to default state without showing 
      // the add bookmark form after successful submission
      // bookmarks.toggleAddingFilter();
      // bookmarks.adding = false;
      // console.log(`handleNewBookmarkSubmit test 2 ${bookmarks.adding}`);
      //
      //

      // store user input values
      const newBookmarkName = $('.js-bookmark-title-entry').val();
      $('.js-bookmark-title-entry').val('');
      const newBookmarkURL = $('.js-bookmark-url-entry').val();
      $('.js-bookmark-url-entry').val('');
      const newBookmarkDescription = $('.js-bookmark-user-description-entry').val();
      $('.js-bookmark-user-description-entry').val('');
      const newStarRating = $('input[name=user-star-rating]:checked').val();
      $('input[name=user-star-rating]:checked').val('');

      // create and add to both API and DOM
      api.createBookmark(newBookmarkName, newBookmarkURL, newBookmarkDescription, newStarRating, (callback) => {
        bookmarks.addItem(callback);
        // bookmarks.adding = false;
        bookmarks.toggleAddingFilter();
        console.log(`handleNewBookmarkSubmit test 2 ${bookmarks.adding}`);
        render();
      });
    });
  }

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete-btn', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        bookmarks.findAndDelete(id);
        render();
      });
    });
  }

  function handleBookmarkDescriptionToggle() {
    $('.js-bookmark-list').on('click', '.js-bookmark-switch', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = bookmarks.items.find((item) => id === item.id);
      const checkedStatus = !bookmark.hideCheckedItems;
      api.updateBookmark(id, {hideCheckedItems: checkedStatus}, () => {
        bookmarks.findAndUpdate(id, {hideCheckedItems: checkedStatus});
        console.log(bookmarks);
        render();
      });
    });
  }

  function handleBookmarkRatingFilter() {
    $('.dropdown').on('click', 'a', function(event) {
      const filterByRating = $(event.target).data('value');
      bookmarks.filterByValue = filterByRating;
      render();
    });
  }

  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleDeleteBookmarkClicked();
    handleBookmarkDescriptionToggle();
    handleAddBookmark();
    handleBookmarkRatingFilter();
  }


  return {
    render,
    bindEventListeners,
  };

}());