const user = {"id":1, "username":"pouros"}

function getUl() {
  return document.querySelector(`#list`)
}
function getDiv() {
  return document.querySelector(`#show-panel`)
}

document.addEventListener("DOMContentLoaded", function() {
  renderBooksList();
});

function renderBooksList() {
  ul = getUl()
  fetch(`http://localhost:3000/books`)
  .then(res=>res.json())
  .then(json=>{
    json.forEach(book=>{
      let li = document.createElement('li')
      li.innerHTML = book.title
      li.addEventListener('click', ()=>renderBookPage(book))
      ul.appendChild(li)

    })
  })

}

function renderBookPage(book) {
  div = getDiv()
  div.innerHTML = ""
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let ul = document.createElement('ul')
  ul.id = `book-${book.id}`
  let miniDiv = document.createElement('div')
  let l = book.users.length
  for(let i = 0; i < l; i++){
    let li = document.createElement('li')
    li.innerHTML = book.users[i].username
    ul.appendChild(li)
  }
  h2.innerHTML = book.title
  img.src = book.img_url
  p.innerHTML = book.description;
  let button = createReaderButton(book)
  div.append(h2,img,p,button,ul)
}
function createReaderButton(book) {
  let button = document.createElement('button')
  button.innerHTML = 'Like this Book!'
  button.addEventListener('click',()=> toggleRead(book,button))
  return button
}

function toggleRead(book,button) {
  let bookBool = book.users.map(pers=>pers.id).includes(user.id)
  let newUsers;
  if(bookBool){
  newUsers = book.users.filter(pers=> pers.id !== user.id)
  }else{
  book.users.push(user)
  newUsers = book.users
  }
  console.log(newUsers)

  fetch(`http://localhost:3000/books/${book.id}`,{
    method: 'PATCH',
  headers:{
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    users : newUsers
  })

  })
  .then(res=> res.json())
  .then(json=>{
    let ul = document.querySelector(`#book-${json.id}`)
    ul.innerHTML =""

    json.users.forEach(user=>{
      let li = document.createElement('li')
      li.innerHTML= user.username
      ul.append(li)
    })
  })
}
