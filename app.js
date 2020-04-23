// Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI() { };
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById("book-list");
  // Create tr
  const row = document.createElement("tr");
  // Insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;

  list.appendChild(row);
};
// Clear fields
UI.prototype.clearFields = function () {
  title.value = "";
  author.value = "";
  isbn.value = "";
}
// Show alert
UI.prototype.showAlert = function (message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const container = document.querySelector(".container");
  // Get form
  const form = document.querySelector("#book-form");
  // Insert alert
  container.insertBefore(div, form);

  // Dissaper after 3 secs
  setTimeout(() => container.removeChild(div), 3000);
}

// Delete Book
UI.prototype.deleteBook = function (target) {
  if (target.className === "delete") {
    target.parentElement.parentElement.remove();
  }
}

// Check books
UI.prototype.checkBooks = function (book) {
  const list = document.getElementById("book-list");
  const listRows = list.children;
  for(let row of listRows) {
    if(row.children[0].innerText === book.title && row.children[1].innerText === book.author && row.children[2].innerText === book.isbn || row.children[2].innerText === book.isbn) {
      return false;
    };
  }
  return true;
}
// LocalStorage constructor
function Store() { };

Store.getBooks = function () {
  let books;
  if (localStorage.getItem("books") === null) {
    books = []
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }

  return books;
};

Store.displayBooks = function () {
  const books = Store.getBooks();
  const ui = new UI();
  books.forEach(function (book) {
    ui.addBookToList(book);
  });
};

Store.addBook = function (book) {
  let books = Store.getBooks();
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
};

Store.removeBook = function (item) {
  let books = Store.getBooks();
  books.forEach(function (book, index) {
    if (book.isbn === item.innerText) {
      books.splice(index, 1);
    };
  });
  localStorage.setItem("books", JSON.stringify(books));
};


// Event listener for add book
document.getElementById("book-form").addEventListener("submit", function (e) {

  // Get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Intantiate book
  const book = new Book(title, author, isbn);

  // Instatiate UI
  const ui = new UI();
  // Validate
  if (title === "" || author === "" || isbn === "") {
    // Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else if (ui.checkBooks(book)){
    // Add book to list
    ui.addBookToList(book);
    // Add book to local storage
    Store.addBook(book);
    // Show success
    ui.showAlert("Book added", "success");
    // Clear fields
    ui.clearFields();
  } else if (!ui.checkBooks(book)) {
    ui.showAlert("This book has been already added or has the same isbn code", "error");
  }


  e.preventDefault();
});

// Event listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {

  // Instantiate the UI
  const ui = new UI();
  // Delete book
  ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling);
  // Show message
  ui.showAlert("Book removed!", "success");
  e.preventDefault();
});

// Event listener for DOMContentloaded
document.addEventListener("DOMContentLoaded", Store.displayBooks);