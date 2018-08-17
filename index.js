const me = {"id": "1", "username": "pouros"}
document.addEventListener("DOMContentLoaded", init)

function init() {
getBooks()
}

function getBooks() {
  fetch('http://localhost:3000/books')
  .then(response => response.json())
  .then(json => {
    for(const book of json){
      renderBook(book)
    }
  })
}

function renderBook(book) {
  let bookList = document.getElementById('list')
  let eachBook = document.createElement('li')

  bookList.appendChild(eachBook)
  eachBook.innerText = book.title
  eachBook.id = `book-${book.id}`
  eachBook.addEventListener('click', bookProfile)
}

function bookProfile(event) {
  event.preventDefault()
  let showBook = document.getElementById('show-panel')
  showBook.innerText = ""
  let id = event.currentTarget.id.split('-')[1]
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let likeButton = document.createElement('button')
  let ul = document.createElement('ul')
  likeButton.addEventListener('click', like)
  showBook.append(h2, img, p, likeButton, ul)
  ul.id = `list-${id}`
  likeButton.innerText = "Like This Book!"
  likeButton.id = `button-${id}`

  fetch(`http://localhost:3000/books/${id}`)
  .then(response => response.json())
  .then(json => {
    h2.innerText = json.title
    img.src = json.img_url
    p.innerText = json.description
    for(let user of json.users) {
      let li = document.createElement('li')
      ul.appendChild(li)
      li.innerText = user.username
      li.dataset.id = user.id
    }
  })
}

function like(event) {
  let arr = []
  let bookProfile = event.currentTarget.parentNode
  let id = bookProfile.querySelector('button').id.split('-')[1]
  let liArr = document.getElementById('show-panel').querySelectorAll('li')
  liArr.forEach(user => {
    arr.push({id: user.dataset.id, username: user.innerText})
  })
  let self = false
  let present = null
  arr.forEach((people, index) => {
    if(people.id == me.id){
      self = true
      present = index
      arr.splice(index, 1)
    }
  })
  if(self === true) {
    alert("You've Already Read This Book")
  }
  if(self === false) {
    arr.push(me)
  }
  patchFetch(arr, event)
}



function patchFetch(arr, event) {
  let bookProfile = event.currentTarget.parentNode
  let id = bookProfile.querySelector('button').id.split('-')[1]

  fetch(`http://localhost:3000/books/${id}`, {
    method:"PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify ({
    users: arr
    })
  }).then(response => response.json())
  .then(json => {
    let ul = document.getElementById(`list-${id}`)
    ul.innerText = ""
    for(let user of json.users) {
    let li = document.createElement('li')
    ul.appendChild(li)
    li.innerText = user.username
    li.dataset.id = user.id
    }
  })
}
