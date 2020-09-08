// Book Constructor 

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Constructor

class UI {

    // Add Book to List
    addBookToList(book) {
        const list = document.querySelector("#book-list");

        // Create Tr element
        const row = document.createElement("tr");

        // Insert TD into ROW
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
            `;

        // Append row to list
        list.appendChild(row);

    }

    // Clear Input Fields
    clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }

    // Error and Sucess Alerts
    showAlert(message, className) {
        // Create a div for error box
        const div = document.createElement("div");

        // Add class
        div.classList = `alert ${className}`;

        // Add text node
        div.appendChild(document.createTextNode(message));

        // Grab the Parent element of the div
        const container = document.querySelector(".container");

        // Grab the form input. We will insert the div before the form
        const form = document.querySelector("#book-form");

        // Insert Before
        container.insertBefore(div, form);

        // set timout for the div to diappear
        setTimeout(function () {
            document.querySelector(".alert").remove();
        }, 2000);
    }

    // Delete Books
    deleteBook(target) {
        if (target.className === "delete") {
            target.parentElement.parentElement.remove();
        }
    }
}

// Local Storage Constructor;

class Store {

    // Fetch Books from Local Storage
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));

        }
        return books;
    }

    static displayBooks() {
        // check and fetch books from Local Storage
        const books = Store.getBooks();

        //Looping through all the books to display them one by one
        books.forEach(book => {

            // Instantiate UI Constructor
            const ui = new UI();

            ui.addBookToList(book);
        });

    }




    // Add Books to LS;

    static addBooksTOLS(book) {
        // check and fetch books from Local Storage
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));

    }

    static removeBookfromLS(isbn){

        // Check and fetch books from LS
        const books = Store.getBooks();

        // Looping through all the books to find the match and delete
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event Listners

//  Event Listner on the Body to display books after reload;

document.body.addEventListener("DOMContentLoaded", Store.displayBooks());

// 1) Event Listner on Submit: Book will be added to the List

document.querySelector("#book-form").addEventListener("submit", function (e) {
    // Get all the values of the inputs

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;


    // Instantiate book constructor where above values will be passed

    const book = new Book(title, author, isbn);

    // Intantiate UI Constructor so that we can add the book on the list

    const ui = new UI();

    // Validate if fields are filled
    if (title === "" || author === "" || isbn === "") {
        // Show error
        ui.showAlert("Please fill all the fields", "error")
    } else {
        // Add to the list
        ui.addBookToList(book);

        // Adding Book to Ls
        Store.addBooksTOLS(book);

        // Success Message
        ui.showAlert("Book Added", "success")

        // Clear Input Fields 
        ui.clearFields();
    }

    e.preventDefault();
})


// 2) Event Listner to Delete the list

document.querySelector("#book-list").addEventListener("click", function (e) {

    // Instantiate UI : TO delete the book

    const ui = new UI();

    // Deleting the book;
    ui.deleteBook(e.target)

    Store.removeBookfromLS(e.target.parentElement.previousElementSibling.textContent);

    // Show Delete Message
    ui.showAlert("Book Deleted", "success")

    e.preventDefault();
})