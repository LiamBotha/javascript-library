let library = [];
const container = document.querySelector("#book-list");
const popup = document.querySelector("#book-popup");
const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close-btn");

addBtn.addEventListener("click", () => {popup.style.display = "block"});
closeBtn.addEventListener("click", () => {popup.style.display = "none"});


if(storageAvailable('localStorage')){

    library = JSON.parse(localStorage.getItem("library") || "[]");
}
else {
    library.push(new Book("Test Title", "Author Name", 100, true));
    library.push(new Book("Test Title 2", "Author Name 2", 200, false));
}

function Book(title, author, pages, bHasBeenRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.bHasBeenRead = bHasBeenRead;
}

Book.prototype.info = () => { this.title + " by " + this.author + ", " + this.pages + " pages, " + bHasBeenRead ? "has been read" : "not read yet" };

displayAllBooks();

function addBookToLibrary(event) {
    event.preventDefault();

    let title = event.target.elements.title.value;
    let author = event.target.elements.author.value;
    let pages = event.target.elements["num-pages"].value;
    let bHasBeenRead = event.target.elements["has-read"].checked;

    library.push(new Book(title, author, pages, bHasBeenRead));

    SaveToLocalStorage();
    
    displayAllBooks();
}

function SaveToLocalStorage() {
    if (storageAvailable('localStorage')) {
        console.dir("saving...");
        console.table(library);
        localStorage.setItem("library", JSON.stringify(library));
    }
}

function displayAllBooks(){
    console.table(library);

    container.innerHTML = "";

    for(bookId in library)
    {
        let card = document.createElement("div");
        let title = document.createElement("h4");
        let author = document.createElement("h5");
        let pages = document.createElement("p");

        let readBtn = document.createElement("button");
        let deleteBtn = document.createElement("button");

        book = library[bookId];
        title.innerText = book.title;
        author.innerText = book.author;
        pages.innerText = book.pages;

        card.classList.add("card");
        card.setAttribute("data-index", bookId);
        
        readBtn.classList.add("read-btn");
        deleteBtn.classList.add("delete-btn");

        readBtn.addEventListener("click", event => { 
            let index = card.getAttribute(("data-index"));
            library[index].bHasBeenRead = !library[index].bHasBeenRead;
            event.target.innerText = library[index].bHasBeenRead ? "Read" : "Not Read";
            SaveToLocalStorage();
        });
        deleteBtn.addEventListener("click", event => {
            if(library.length <= 1)
                library = [];
            else 
                library.splice(card.getAttribute("data-index"), 1);
            
            SaveToLocalStorage();
            displayAllBooks();
        });

        readBtn.innerText = book.bHasBeenRead ? "Read" : "Not Read";
        deleteBtn.innerText = "X";

        card.appendChild(title);
        card.appendChild(author);
        card.appendChild(pages);
        card.appendChild(readBtn);
        card.appendChild(deleteBtn);

        container.appendChild(card);
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}