const myUser = {"id":1, "username":"pouros"}

document.addEventListener("DOMContentLoaded", function() {
  fetchBooks()
});

function fetchBooks() {
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(json => {
      json.forEach(book => renderListItem(book))
    })
}

function renderListItem(book) {
  let li = document.createElement('li')
  let ul = document.querySelector('#list-panel')

  ul.append(li)

  li.innerText = book.title
  li.id = `book-${book.id}`
  li.addEventListener('click', () => fetchBook(book.id))
}

function fetchBook(id) {
  fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
    .then(json => renderBook(json))
}

function renderBook(book) {
  let showPanel = document.querySelector('#show-panel')
  let div = document.createElement('div')
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let button = document.createElement('button')

  h2.innerText = book.title
  img.src = book.img_url
  p.innerText = book.description
  button.innerText = "Like Book"
  button.id = `book-${book.id}`
  div.id = "user-likes"
  button.addEventListener('click', addOrRemoveLike)

  showPanel.innerHTML = ""
  showPanel.append(h2, img, p, div, button)

  if (book.users) {
    book.users.forEach(user => {
      createLikeH4(user, div)
    })
  }
}

function createLikeH4(userObj, div) {
  let h4 = document.createElement('h4')
  h4.innerText = userObj.username
  h4.id = `user-${userObj.id}`
  div.append(h4)
}

function addOrRemoveLike(e) {
  let bookId = e.currentTarget.id.split("-")[1]
  let userLikes = Array.from(e.currentTarget.parentElement.querySelectorAll('h4'))
  let index = userLikes.findIndex(element => element.id.split("-")[1] == myUser.id)
  let userObjArray = userLikes.map(h4 => {
    return { "id": parseInt(h4.id.split("-")[1]), "username": h4.innerText}
  })

  if (index > -1) {
    userObjArray.splice(index, 1)
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        users: [...userObjArray]
      })
    })
      .then(r => r.json())
      .then(json => {
        userLikes[index].remove()
      })
  } else {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        users: [...userObjArray, myUser]
      })
    })
      .then(r => r.json())
      .then(json => {
        createLikeH4(myUser, document.querySelector('#user-likes'))
      })
  }
}
