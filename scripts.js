const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");
const messageDiv = document.getElementById("message");
const clearBooksBtn = document.getElementById("clear-books");
const popup = document.getElementById("popup");
const popupContent = document.querySelector(".popup-content");
const closeBtn = document.querySelector(".close-btn");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupAuthor = document.getElementById("popup-author");
const popupDescription = document.getElementById("popup-description");

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const cover = document.getElementById("cover").value;
  const description = document.getElementById("description").value;

  if (title === "" || author === "") {
    showMessage("Por favor, preencha todos os campos", "error");
    return;
  }

  addBook(title, author, cover, description);
  showMessage("Livro adicionado com sucesso", "success");
  bookForm.reset();
});

bookList.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const li = e.target.parentElement;
    removeBook(li);
    bookList.removeChild(li);
    showMessage("Livro removido com sucesso", "success");
  }
});

bookList.addEventListener("click", function (e) {
  if (e.target.tagName === "SPAN") {
    const li = e.target.closest("li");
    const bookDetails = JSON.parse(li.getAttribute("data-details"));

    popupImg.src = bookDetails.cover
      ? bookDetails.cover
      : "https://via.placeholder.com/150";
    popupTitle.textContent = bookDetails.title;
    popupAuthor.textContent = `por ${bookDetails.author}`;
    popupDescription.textContent = bookDetails.description;

    popup.style.display = "flex";
  }
});

closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

searchInput.addEventListener("input", function (e) {
  const term = e.target.value.toLowerCase();
  const books = bookList.getElementsByTagName("li");
  Array.from(books).forEach(function (book) {
    const title = book
      .querySelector(".book-details span")
      .textContent.toLowerCase();
    if (title.indexOf(term) != -1) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }
  });
});

clearBooksBtn.addEventListener("click", function () {
  clearBooks();
  showMessage("Todos os livros foram removidos", "success");
});

function showMessage(message, className) {
  messageDiv.className = className;
  messageDiv.textContent = message;
  setTimeout(() => (messageDiv.textContent = ""), 3000);
}

function addBook(title, author, cover, description) {
  const li = document.createElement("li");
  li.setAttribute(
    "data-details",
    JSON.stringify({ title, author, cover, description })
  );

  const bookDetails = document.createElement("div");
  bookDetails.className = "book-details";

  const img = document.createElement("img");
  img.src = cover ? cover : "https://via.placeholder.com/50";
  bookDetails.appendChild(img);

  const span = document.createElement("span");
  span.appendChild(document.createTextNode(title));
  bookDetails.appendChild(span);

  li.appendChild(bookDetails);

  const removeButton = document.createElement("button");
  removeButton.appendChild(document.createTextNode("Remover"));
  li.appendChild(removeButton);
  bookList.appendChild(li);

  storeBookInLocalStorage(title, author, cover, description);
}

function removeBook(bookItem) {
  const books = JSON.parse(localStorage.getItem("books"));
  const bookIndex = Array.from(bookList.children).indexOf(bookItem);
  books.splice(bookIndex, 1);
  localStorage.setItem("books", JSON.stringify(books));
}

function storeBookInLocalStorage(title, author, cover, description) {
  let books;
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }
  books.push({ title, author, cover, description });
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
  let books;
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }
  books.forEach(function (book) {
    addBook(book.title, book.author, book.cover, book.description);
  });
}

function clearBooks() {
  localStorage.removeItem("books");
  bookList.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", loadBooks);
