const showModalButton = document.getElementById('show-modal');
const bookmarksContainer = document.getElementById('bookmarks-container');
const modalContainer = document.getElementById('modal');
const closeModalButton = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameElement = document.getElementById('website-name');
const websiteUrlElement = document.getElementById('website-url');

let bookmarks = [];

//showing modal
const showModal = () => {
  modalContainer.classList.add('show-modal');
  websiteNameElement.focus();
};

//close modal
const closeModal = () => {
  modalContainer.classList.remove('show-modal');
};

//validate form
const validateForm = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('please enter a valid name and url');
    return false;
  }

  if (!urlValue.match(regex)) {
    alert('please enter a valid web address');
    return false;
  }
  return true;
};
//bulid bookmarks DOM
const buildBookmarks = ()=>{
  //remove all bookmark elements
  bookmarksContainer.textContent = ''
  //build itmes
  bookmarks.forEach((bookmark)=>{
    const {name, url} = bookmark
    //create item div
    const item = document.createElement('div');
    item.classList.add('item');
    //create close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid' ,'fa-xmark');
    closeIcon.setAttribute('title', 'Delete Bookmark')
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
    //create favicon / link container
    const linkInfo = document.createElement('div')
    linkInfo.classList.add('name')
    //create favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
    favicon.setAttribute('alt', 'Favicon')
    //create link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`)
    link.setAttribute('target', '_blank')
    link.textContent = name
    //Append to bookmarks container
    linkInfo.append(favicon, link)
    item.append(closeIcon, linkInfo)
    bookmarksContainer.appendChild(item)
  })
}

//fetch bookmarks from localstorage
const fetchBookmarks = () => {
  //get bookmarks if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    //add bookmarks to localstorage
    bookmarks = [
      {
        name: 'google',
        url: 'https://google.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
  }
  buildBookmarks();
};

//delete bookmark
const deleteBookmark = (url)=>{
  bookmarks.forEach((bookmark, index)=>{
    if(bookmark.url === url){
      bookmarks.splice(index, 1)
    }
  });
  //update bookmarks in localstorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  buildBookmarks()
}

//handle form submittion
const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameElement.value;
  let urlValue = websiteUrlElement.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!validateForm(nameValue, urlValue)) {
    return false;
  }
  const bookmark = { name: nameValue, url: urlValue };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  buildBookmarks();
  bookmarkForm.reset();
  websiteNameElement.focus();
};
//addEventListener
showModalButton.addEventListener('click', showModal);
closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) =>
  e.target === modalContainer ? closeModal() : false,
);
bookmarkForm.addEventListener('submit', storeBookmark);

//onload
fetchBookmarks();
