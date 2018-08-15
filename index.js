let me = {id:1, username: "pouros"}
let id
let users = []
document.addEventListener("DOMContentLoaded", function() {
  fetchBooks()

});

function fetchBooks(){
  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(json => {
    json.forEach((book)=> {renderBook(book)
    })
  })
}

function renderBook(book){
  let ul = document.querySelector('#list')
  let li = document.createElement('li')
  li.innerText = book.title
  li.id = `book-${book.id}`
  li.addEventListener('click', getBook)
  ul.appendChild(li)
}

function getBook(e) {
  id = e.currentTarget.id.split('-')[1]
  fetch(`http://localhost:3000/books/${id}`)
  .then(res => res.json())
  .then(json => {showBook(json)})
}

function showBook(book) {
  users = []
  let showDiv = document.querySelector('#show-panel')
  showDiv.innerHTML = ""
  let h1 = document.createElement('h1')
  let img = document.createElement('img')
  let ul = document.createElement('ul')
  let p = document.createElement('p')
  let button = document.createElement('button')
  button.addEventListener('click', like)
  h1.innerText = book.title
  img.src = book.img_url
  p.innerText = book.description
  button.innerText = 'Like 🤙🏼'
  showDiv.appendChild(h1)
  showDiv.appendChild(img)
  showDiv.appendChild(p)
  showDiv.appendChild(ul)
  showDiv.appendChild(button)
  if (book.users !== undefined){
    users = book.users
    book.users.forEach((user)=>{
      let li = document.createElement('li')
      li.innerText = user.username
      ul.appendChild(li)
    })
  }
}

function like(e) {
  let div = e.currentTarget.parentNode
  let ul = div.querySelector('ul')
  let check
  let arr = []
  if (users !== []) {
    check = users.includes(me)
  }
  if (check === false){
    users.push(me)
  }
  else{
    arr = users
    users = []
    arr.forEach((user)=> {
      if(user !== me){
        users.push(user)
      }
    })
  }
  fetch(`http://localhost:3000/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/jason',
      Accepts: 'application/json'
    },
    body: JSON.stringify ({
      users: users
    })
  })
  ul.innerHTML = ''
  users.forEach((user)=>{
    let li = document.createElement('li')
    li.innerText = user.username
    ul.appendChild(li)
  })
}
