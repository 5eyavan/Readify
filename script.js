/* ============================
   Readify - script.js
   - One file for all pages
   - localStorage + JSON
   - Simple naming
============================ */


/* ============================
   Global Data
============================ */

let booksList = [];
let authorsList = [];


/* ============================
   Helper: localStorage (JSON)
============================ */

// Get array safely
function getSavedArray(storageKey) {
    let savedText = localStorage.getItem(storageKey);

    if (savedText === null) {
        return [];
    }

    try {
        return JSON.parse(savedText);
    } catch (error) {
        return [];
    }
}

// Save array
function saveArray(storageKey, arrayValue) {
    localStorage.setItem(storageKey, JSON.stringify(arrayValue));
}


/* ============================
   Completed Books (localStorage)
============================ */

function getCompletedBooksList() {
    let list = getSavedArray("readifyCompletedBooks");

    // make sure it is always an array of strings
    let cleaned = [];
    for (let i = 0; i < list.length; i++) {
        let idText = String(list[i] || "").trim();
        if (idText !== "") {
            cleaned.push(idText);
        }
    }

    // remove duplicates
    let unique = [];
    for (let i = 0; i < cleaned.length; i++) {
        let already = false;
        for (let j = 0; j < unique.length; j++) {
            if (unique[j].toLowerCase() === cleaned[i].toLowerCase()) {
                already = true;
                break;
            }
        }
        if (already === false) {
            unique.push(cleaned[i]);
        }
    }

    return unique;
}

function isBookCompleted(bookId) {
    let idText = String(bookId || "").trim().toLowerCase();
    if (idText === "") return false;

    let list = getCompletedBooksList();
    for (let i = 0; i < list.length; i++) {
        if (list[i].toLowerCase() === idText) {
            return true;
        }
    }
    return false;
}

function addBookToCompleted(bookId) {
    let idText = String(bookId || "").trim();
    if (idText === "") return false;

    if (isBookCompleted(idText)) {
        return false;
    }

    let list = getCompletedBooksList();

    // newest first
    list.unshift(idText);

    saveArray("readifyCompletedBooks", list);
    return true;
}


/* ============================
   Helper: Load JSON file
============================ */

function loadJsonFile(jsonPath, successFunction, failFunction) {
    fetch(jsonPath)
        .then(function (response) {
            if (response.ok === false) {
                throw new Error("JSON file not found: " + jsonPath);
            }
            return response.json();
        })
        .then(function (data) {
            successFunction(data);
        })
        .catch(function (error) {
            if (failFunction) {
                failFunction(error);
            }
        });
}


/* ============================
   Helper: Unique list (no duplicates)
============================ */

function getUniqueTextList(textArray) {
    let uniqueList = [];

    for (let i = 0; i < textArray.length; i++) {
        let item = (textArray[i] || "").trim();

        if (item === "") {
            continue;
        }

        let alreadyAdded = false;

        for (let j = 0; j < uniqueList.length; j++) {
            if (uniqueList[j].toLowerCase() === item.toLowerCase()) {
                alreadyAdded = true;
                break;
            }
        }

        if (alreadyAdded === false) {
            uniqueList.push(item);
        }
    }

    return uniqueList;
}

function getBookGenresOnly() {
    let allGenres = [];

    for (let i = 0; i < booksList.length; i++) {
        allGenres.push(booksList[i].genre);
    }

    return getUniqueTextList(allGenres);
}


/* ============================
   Mobile Navbar (Hamburger)
============================ */

function setupMobileNavbar() {
    let navbar = document.getElementsByClassName("navbar")[0];
    let hamburgerButton = document.getElementsByClassName("nav-toggle")[0];

    if (!navbar || !hamburgerButton) {
        return;
    }

    hamburgerButton.addEventListener("click", function () {
        navbar.classList.toggle("is-open");

        let isOpenNow = navbar.classList.contains("is-open");
        hamburgerButton.setAttribute("aria-expanded", isOpenNow ? "true" : "false");
    });
}


/* ============================
   Footer Newsletter Subscribe
============================ */

function setupNewsletterForm() {
    let txtSubscriberEmail = document.getElementById("subscriber-email");
    let chkConsent = document.getElementById("subscribe-consent");

    if (!txtSubscriberEmail || !chkConsent) {
        return;
    }

    let newsletterForm = txtSubscriberEmail.form;

    if (!newsletterForm) {
        return;
    }

    newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let email = txtSubscriberEmail.value.trim();

        if (email === "") {
            alert("Please enter your email.");
            return;
        }

        if (chkConsent.checked === false) {
            alert("Please tick the consent checkbox.");
            return;
        }

        let subscribers = getSavedArray("readifyNewsletterSubscribers");

        // avoid duplicates
        for (let i = 0; i < subscribers.length; i++) {
            if (subscribers[i].toLowerCase() === email.toLowerCase()) {
                alert("This email is already subscribed.");
                return;
            }
        }

        subscribers.push(email);
        saveArray("readifyNewsletterSubscribers", subscribers);

        alert("Subscribed successfully!");

        txtSubscriberEmail.value = "";
        chkConsent.checked = false;
    });
}


/* ============================
   Home Page: Quote rotation
============================ */

function setupHeroQuoteRotation() {
    let quoteBlock = document.getElementsByClassName("hero-quote")[0];
    let quoteAuthor = document.getElementsByClassName("hero-quote-author")[0];

    if (!quoteBlock || !quoteAuthor) {
        return;
    }

    let quotesList = [
        { quote: "A reader lives a thousand lives before he dies.", author: "― George R.R. Martin" },
        { quote: "Books are a uniquely portable magic.", author: "― Stephen King" },
        { quote: "Not all those who wander are lost.", author: "― J.R.R. Tolkien" },
        { quote: "It is our choices that show what we truly are.", author: "― J.K. Rowling" }
    ];

    let currentQuoteIndex = 0;

    function setQuote(index) {
        quoteBlock.childNodes[0].nodeValue = quotesList[index].quote + " ";
        quoteAuthor.innerText = quotesList[index].author;
    }

    setQuote(currentQuoteIndex);

    setInterval(function () {
        currentQuoteIndex = currentQuoteIndex + 1;

        if (currentQuoteIndex >= quotesList.length) {
            currentQuoteIndex = 0;
        }

        setQuote(currentQuoteIndex);
    }, 6000);
}


/* ============================
   Home Page: Author of the Day
============================ */

function setupAuthorOfTheDay() {
    let authorSection = document.getElementsByClassName("author-of-the-day")[0];

    if (!authorSection) {
        return;
    }

    let authorImage = authorSection.getElementsByClassName("author-image")[0];
    let authorName = authorSection.getElementsByClassName("author-name")[0];
    let authorBio = authorSection.getElementsByClassName("author-bio")[0];

    let authorLinks = authorSection.getElementsByClassName("author-links")[0];
    let authorButton = authorSection.getElementsByClassName("author-button")[0];

    if (!authorImage || !authorName || !authorBio || !authorLinks) {
        return;
    }

    let wikiLink = authorLinks.getElementsByTagName("a")[0];
    let xLink = authorLinks.getElementsByTagName("a")[1];

    function getDayOfYear(dateValue) {
        let startOfYear = new Date(dateValue.getFullYear(), 0, 0);
        let diff = dateValue - startOfYear;
        let oneDay = 24 * 60 * 60 * 1000;
        return Math.floor(diff / oneDay);
    }

    function showAuthor(authorItem) {
        authorImage.src = authorItem.image || "assets/images/authors/sample.jpg";
        authorImage.alt = "Portrait of " + authorItem.name;

        authorName.innerText = authorItem.name || "Unknown Author";
        authorBio.innerText = authorItem.bio || "";

        if (wikiLink) {
            wikiLink.href = authorItem.wiki || "#";
        }

        if (xLink) {
            xLink.href = authorItem.x || "#";
        }

        if (authorButton) {
            authorButton.addEventListener("click", function () {
                window.location.href = "explorer.html";
            });
        }
    }

    loadJsonFile(
        "assets/data/authors.json",
        function (data) {
            if (Array.isArray(data) === false || data.length === 0) {
                return;
            }

            authorsList = data;

            let today = new Date();
            let dayNumber = getDayOfYear(today);
            let authorIndex = dayNumber % authorsList.length;

            showAuthor(authorsList[authorIndex]);
        },
        function () {
            showAuthor({
                name: "Sample Author",
                bio: "Add your authors.json to show real author of the day.",
                wiki: "#",
                x: "#",
                image: "assets/images/authors/sample.jpg"
            });
        }
    );
}


/* ============================
   Load Books JSON (once)
============================ */

function loadBooksData(afterLoadedFunction) {
    loadJsonFile(
        "assets/data/books.json",
        function (data) {
            if (Array.isArray(data)) {
                booksList = data;
            } else {
                booksList = [];
            }

            afterLoadedFunction();
        },
        function () {
            booksList = [
                {
                    id: 1,
                    title: "Sample Book One",
                    author: "Sample Author",
                    genre: "Fiction",
                    pages: 320,
                    rating: 4.2,
                    description: "Replace with your books.json later.",
                    cover: "assets/images/books/sample1.jpg",
                    synopsis: "Replace with synopsis later.",
                    prequels: [],
                    sequels: [],
                    reviews: [
                        { reviewer: "A", rating: 4, comment: "Good" }
                    ],
                    buyLink: "#"
                }
            ];

            afterLoadedFunction();
        }
    );
}


/* ============================
   Explorer Page
============================ */

function setupExplorerPage() {
    let bookGrid = document.getElementsByClassName("book-grid")[0];
    let searchInput = document.getElementById("book-search");
    let filterBar = document.getElementsByClassName("filter-bar")[0];

    if (!bookGrid || !searchInput || !filterBar) {
        return;
    }

    function buildGenreButtons() {
        filterBar.innerHTML = "";

        let allButton = document.createElement("button");
        allButton.className = "filter-btn active";
        allButton.type = "button";
        allButton.innerText = "All";
        filterBar.appendChild(allButton);

        let genres = getBookGenresOnly();

        for (let i = 0; i < genres.length; i++) {
            let btn = document.createElement("button");
            btn.className = "filter-btn";
            btn.type = "button";
            btn.innerText = genres[i];
            filterBar.appendChild(btn);
        }
    }

    function getSelectedGenre() {
        let buttons = filterBar.getElementsByClassName("filter-btn");

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains("active")) {
                return buttons[i].innerText.trim();
            }
        }

        return "All";
    }

    function setActiveGenre(clickedButton) {
        let buttons = filterBar.getElementsByClassName("filter-btn");

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }

        clickedButton.classList.add("active");
    }

    function showBooksOnGrid(booksToShow) {
        bookGrid.innerHTML = "";

        if (booksToShow.length === 0) {
            let msg = document.createElement("p");
            msg.innerText = "No books found.";
            bookGrid.appendChild(msg);
            return;
        }

        for (let i = 0; i < booksToShow.length; i++) {
            let book = booksToShow[i];

            let card = document.createElement("article");
            card.className = "book-card";

            let coverBox = document.createElement("div");
            coverBox.className = "book-cover";

            let coverImg = document.createElement("img");
            coverImg.src = book.cover || "assets/images/books/sample1.jpg";
            coverImg.alt = book.title + " cover";
            coverImg.style.width = "100%";
            coverImg.style.height = "100%";
            coverImg.style.objectFit = "cover";
            coverImg.style.display = "block";

            coverBox.appendChild(coverImg);

            let infoBox = document.createElement("div");
            infoBox.className = "book-info";

            let titleText = document.createElement("h3");
            titleText.className = "book-title";
            titleText.innerText = book.title;

            let authorText = document.createElement("p");
            authorText.className = "book-author";
            authorText.innerText = book.author;

            infoBox.appendChild(titleText);
            infoBox.appendChild(authorText);

            card.appendChild(coverBox);
            card.appendChild(infoBox);

            card.addEventListener("click", function () {
                openBookDetailsModal(book);
            });

            bookGrid.appendChild(card);
        }
    }

    function applyExplorerFilters() {
        let selectedGenre = getSelectedGenre();
        let searchText = searchInput.value.trim().toLowerCase();

        let filteredBooks = [];

        for (let i = 0; i < booksList.length; i++) {
            let book = booksList[i];

            let genreText = (book.genre || "").trim();
            let titleText = (book.title || "").toLowerCase();
            let authorText = (book.author || "").toLowerCase();

            let matchesGenre = true;

            if (selectedGenre !== "All") {
                matchesGenre = genreText.toLowerCase() === selectedGenre.toLowerCase();
            }

            let matchesSearch =
                titleText.includes(searchText) ||
                authorText.includes(searchText) ||
                genreText.toLowerCase().includes(searchText);

            if (matchesGenre && matchesSearch) {
                filteredBooks.push(book);
            }
        }

        showBooksOnGrid(filteredBooks);
    }

    buildGenreButtons();

    filterBar.addEventListener("click", function (event) {
        if (event.target.classList.contains("filter-btn")) {
            setActiveGenre(event.target);
            applyExplorerFilters();
        }
    });

    searchInput.addEventListener("input", function () {
        applyExplorerFilters();
    });

    applyExplorerFilters();
}


/* ============================
   Explorer Modal (Wireframe)
============================ */

function openBookDetailsModal(book) {

    let oldOverlay = document.getElementById("book-modal-overlay");
    if (oldOverlay) {
        oldOverlay.remove();
    }

    let overlay = document.createElement("div");
    overlay.id = "book-modal-overlay";
    overlay.className = "book-modal-overlay";

    let modal = document.createElement("div");
    modal.className = "book-modal";

    let inner = document.createElement("div");
    inner.className = "book-modal-inner";

    // NEW: scroll wrapper (your CSS handles scroll)
    let scrollArea = document.createElement("div");
    scrollArea.className = "book-modal-scroll";

    let btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.className = "book-modal-close";
    btnClose.setAttribute("aria-label", "Close");

    let closeIcon = document.createElement("img");
    closeIcon.src = "assets/images/icons/xmark-solid-full.svg";
    closeIcon.alt = "";
    closeIcon.setAttribute("aria-hidden", "true");

    btnClose.appendChild(closeIcon);

    function closeModal() {
        overlay.remove();
        document.removeEventListener("keydown", escToClose);
    }

    btnClose.addEventListener("click", closeModal);

    // ---------- TOP ----------
    let top = document.createElement("div");
    top.className = "book-modal-top";

    let coverBox = document.createElement("div");
    coverBox.className = "book-modal-cover";

    if (book.cover) {
        let coverImg = document.createElement("img");
        coverImg.src = book.cover;
        coverImg.alt = book.title + " cover";
        coverBox.appendChild(coverImg);
    } else {
        coverBox.innerText = "Book Cover";
    }

    let details = document.createElement("div");

    let titleRow = document.createElement("div");
    titleRow.className = "book-modal-title-row";

    let title = document.createElement("h2");
    title.className = "book-modal-title";
    title.innerText = book.title || "Book Title";

    let ratingBox = document.createElement("div");
    ratingBox.className = "book-modal-rating";

    let ratingNumber = getBookRatingNumber(book);
    ratingBox.innerText = getStarText(ratingNumber);

    titleRow.appendChild(title);
    titleRow.appendChild(ratingBox);

    let author = document.createElement("p");
    author.className = "book-modal-author";
    author.innerText = book.author ? ("By " + book.author) : "";

    let desc = document.createElement("p");
    desc.className = "book-modal-desc";
    desc.innerText = book.synopsis || book.description || "";

    let actions = document.createElement("div");
    actions.className = "book-modal-actions";

    if (book.buyLink) {
        let buyBtn = document.createElement("a");
        buyBtn.className = "book-modal-buy";
        buyBtn.href = book.buyLink;
        buyBtn.target = "_blank";
        buyBtn.rel = "noopener";
        buyBtn.innerText = "Buy this book";
        actions.appendChild(buyBtn);
    }

    // NEW: Completed button
    let completedBtn = document.createElement("button");
    completedBtn.type = "button";

    if (isBookCompleted(book.id)) {
        completedBtn.innerText = "Completed";
        completedBtn.disabled = true;
    } else {
        completedBtn.innerText = "Mark as completed";
    }

    completedBtn.addEventListener("click", function () {
        let added = addBookToCompleted(book.id);

        if (added) {
            completedBtn.innerText = "Completed";
            completedBtn.disabled = true;
            alert("Added to completed books!");
        } else {
            alert("Already completed.");
        }
    });

    actions.appendChild(completedBtn);

    details.appendChild(titleRow);
    details.appendChild(author);
    details.appendChild(desc);
    details.appendChild(actions);

    top.appendChild(coverBox);
    top.appendChild(details);

    let divider = document.createElement("div");
    divider.className = "book-modal-divider";

    // ---------- BOTTOM ----------
    let bottom = document.createElement("div");
    bottom.className = "book-modal-bottom";

    // LEFT: Series (prequels + sequels only, lookup by ID)
    let relatedWrap = document.createElement("div");

    let relatedTitle = document.createElement("h3");
    relatedTitle.className = "book-modal-section-title";
    relatedTitle.innerText = "Series";

    let relatedGrid = document.createElement("div");
    relatedGrid.className = "book-modal-related-grid";

    relatedWrap.appendChild(relatedTitle);

    let relatedIds = getSeriesTitlesOneList(book); // returns prequels+sequels list

    if (relatedIds.length === 0) {
        let noSeries = document.createElement("p");
        noSeries.innerText = "No series books listed.";
        relatedWrap.appendChild(noSeries);
    } else {
        for (let i = 0; i < relatedIds.length; i++) {

            let relatedId = relatedIds[i];

            // NOT title search: ID lookup
            let relatedBook = findBookById(relatedId);

            let miniCard = document.createElement("div");
            miniCard.className = "book-modal-related-card";

            let miniCover = document.createElement("div");
            miniCover.className = "book-modal-related-cover";

            let miniName = document.createElement("p");
            miniName.className = "book-modal-related-name";

            if (relatedBook) {
                // show actual title + cover if found
                if (relatedBook.cover) {
                    let img = document.createElement("img");
                    img.src = relatedBook.cover;
                    img.alt = relatedBook.title + " cover";
                    miniCover.appendChild(img);
                } else {
                    miniCover.innerText = "Book Cover";
                }

                miniName.innerText = relatedBook.title || relatedId;

                // optional open modal
                miniCard.addEventListener("click", function () {
                    openBookDetailsModal(relatedBook);
                });
            } else {
                // if ID not found in JSON, still show text
                miniCover.innerText = "Book Cover";
                miniName.innerText = relatedId;
            }

            miniCard.appendChild(miniCover);
            miniCard.appendChild(miniName);
            relatedGrid.appendChild(miniCard);
        }

        relatedWrap.appendChild(relatedGrid);
    }

    // RIGHT: Reviews
    let reviewsWrap = document.createElement("div");

    let reviewsTitle = document.createElement("h3");
    reviewsTitle.className = "book-modal-section-title";
    reviewsTitle.innerText = "Reviews";

    let table = document.createElement("table");
    table.className = "book-modal-table";

    let tbody = document.createElement("tbody");

    if (book.reviews && book.reviews.length > 0) {
        for (let r = 0; r < book.reviews.length; r++) {
            let reviewItem = book.reviews[r];

            let row = document.createElement("tr");

            let tdText = document.createElement("td");

            let p = document.createElement("p");
            p.className = "book-modal-review-text";

            let reviewerName = reviewItem.reviewer || "Anonymous";
            let commentText = reviewItem.comment || "";
            p.innerText = reviewerName + ": " + commentText;

            tdText.appendChild(p);

            let tdRating = document.createElement("td");
            tdRating.className = "book-modal-review-rating";

            let ratingSpan = document.createElement("span");
            ratingSpan.innerText = getStarText(Number(reviewItem.rating || 0));

            tdRating.appendChild(ratingSpan);

            row.appendChild(tdText);
            row.appendChild(tdRating);

            tbody.appendChild(row);
        }
    } else {
        let row = document.createElement("tr");

        let td = document.createElement("td");
        td.colSpan = 2;
        td.innerText = "No reviews yet.";
        row.appendChild(td);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    reviewsWrap.appendChild(reviewsTitle);
    reviewsWrap.appendChild(table);

    bottom.appendChild(relatedWrap);
    bottom.appendChild(reviewsWrap);

    // Build final modal (with scroll)
    inner.appendChild(top);

    scrollArea.appendChild(inner);
    scrollArea.appendChild(divider);
    scrollArea.appendChild(bottom);

    modal.appendChild(btnClose);
    modal.appendChild(scrollArea);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    function escToClose(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    }
    document.addEventListener("keydown", escToClose);
}


/* ============================
   Small helpers (modal)
============================ */

function getStarText(ratingNumber) {
    let number = Number(ratingNumber || 0);

    if (number < 0) number = 0;
    if (number > 5) number = 5;

    let filled = Math.round(number);

    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += (i < filled) ? "★ " : "☆ ";
    }

    return stars.trim();
}

// UPDATED: rating = average from reviews (if reviews exist)
function getBookRatingNumber(book) {

    if (book && book.reviews && book.reviews.length > 0) {
        let total = 0;

        for (let i = 0; i < book.reviews.length; i++) {
            total += Number(book.reviews[i].rating || 0);
        }

        return total / book.reviews.length;
    }

    if (typeof book.rating === "number") {
        return book.rating;
    }

    return 0;
}

function getSeriesTitlesOneList(book) {

    let seriesList = [];

    if (book.prequels && book.prequels.length > 0) {
        for (let i = 0; i < book.prequels.length; i++) {
            seriesList.push((book.prequels[i] || "").trim());
        }
    }

    if (book.sequels && book.sequels.length > 0) {
        for (let i = 0; i < book.sequels.length; i++) {
            seriesList.push((book.sequels[i] || "").trim());
        }
    }

    let uniqueList = [];

    for (let i = 0; i < seriesList.length; i++) {

        if (seriesList[i] === "") continue;

        let alreadyAdded = false;

        for (let j = 0; j < uniqueList.length; j++) {
            if (uniqueList[j].toLowerCase() === seriesList[i].toLowerCase()) {
                alreadyAdded = true;
                break;
            }
        }

        if (alreadyAdded === false) {
            uniqueList.push(seriesList[i]);
        }
    }

    return uniqueList;
}

// Find book by ID 
function findBookById(idText) {

    let searchingId = String(idText || "").trim().toLowerCase();

    if (searchingId === "") {
        return null;
    }

    for (let i = 0; i < booksList.length; i++) {

        let currentId = String(booksList[i].id || "").trim().toLowerCase();

        if (currentId === searchingId) {
            return booksList[i];
        }
    }

    return null;
}


/* ============================
   Tracker Page
============================ */

function setupTrackerPage() {
    let trackerFormWrap = document.getElementsByClassName("tracker-form")[0];
    let progressWrap = document.getElementsByClassName("tracker-progress")[0];

    if (!trackerFormWrap || !progressWrap) {
        return;
    }

    let txtPagesRead = document.getElementById("pages-read");
    let txtTotalPages = document.getElementById("total-pages");
    let txtSpeed = document.getElementById("reading-speed");

    let trackerForm = trackerFormWrap.getElementsByTagName("form")[0];
    let saveButton = trackerForm ? trackerForm.getElementsByTagName("button")[0] : null;

    let percentText = progressWrap.getElementsByClassName("progress-percent")[0];
    let progressFill = progressWrap.getElementsByClassName("progress-fill")[0];

    let statsWrap = progressWrap.getElementsByClassName("progress-stats")[0];
    let statsStrongTags = statsWrap ? statsWrap.getElementsByTagName("strong") : [];

    function getFinishText(pagesLeft, speedPerDay) {
        if (pagesLeft <= 0) {
            return "Done";
        }

        if (speedPerDay <= 0) {
            return "--";
        }

        let days = pagesLeft / speedPerDay;

        if (days <= 1) {
            return "Today";
        }

        let roundedDays = Math.ceil(days);

        if (roundedDays === 1) {
            return "1 day";
        }

        return roundedDays + " days";
    }

    function updateProgressUI(pagesRead, totalPages, speedPerDay) {
        pagesRead = Number(pagesRead || 0);
        totalPages = Number(totalPages || 0);
        speedPerDay = Number(speedPerDay || 0);

        if (isNaN(pagesRead)) pagesRead = 0;
        if (isNaN(totalPages)) totalPages = 0;
        if (isNaN(speedPerDay)) speedPerDay = 0;

        if (pagesRead < 0) pagesRead = 0;
        if (totalPages < 0) totalPages = 0;

        if (totalPages > 0 && pagesRead > totalPages) {
            pagesRead = totalPages;
        }

        let percentNumber = 0;
        if (totalPages > 0) {
            percentNumber = Math.round((pagesRead / totalPages) * 100);
        }

        if (percentNumber < 0) percentNumber = 0;
        if (percentNumber > 100) percentNumber = 100;

        let pagesLeft = totalPages - pagesRead;
        if (pagesLeft < 0) pagesLeft = 0;

        let finishText = getFinishText(pagesLeft, speedPerDay);

        if (percentText) {
            percentText.innerText = percentNumber + "%";
        }

        if (progressFill) {
            progressFill.style.width = percentNumber + "%";
        }

        // 0 = pages read, 1 = pages left, 2 = finish in
        if (statsStrongTags.length >= 1) statsStrongTags[0].innerText = pagesRead;
        if (statsStrongTags.length >= 2) statsStrongTags[1].innerText = pagesLeft;
        if (statsStrongTags.length >= 3) statsStrongTags[2].innerText = finishText;
    }

    function loadSavedProgress() {
        let saved = localStorage.getItem("readifyTrackerProgress");

        if (saved === null) {
            updateProgressUI(0, 0, 0);
            return;
        }

        try {
            let data = JSON.parse(saved);

            // support old saved format too
            let pagesRead = data.pagesRead;
            if (pagesRead === undefined) pagesRead = data.currentPage;

            let totalPages = data.totalPages;

            let speedPerDay = data.speedPerDay;
            if (speedPerDay === undefined) speedPerDay = data.readingSpeed;

            if (txtPagesRead) txtPagesRead.value = pagesRead || "";
            if (txtTotalPages) txtTotalPages.value = totalPages || "";
            if (txtSpeed) txtSpeed.value = speedPerDay || "";

            updateProgressUI(Number(pagesRead || 0), Number(totalPages || 0), Number(speedPerDay || 0));
        } catch (error) {
            updateProgressUI(0, 0, 0);
        }
    }

    if (saveButton) {
        saveButton.addEventListener("click", function (event) {
            event.preventDefault();

            let pagesRead = parseInt(txtPagesRead.value, 10);
            let totalPages = parseInt(txtTotalPages.value, 10);
            let speedPerDay = parseInt(txtSpeed.value, 10);

            if (isNaN(pagesRead) || isNaN(totalPages) || isNaN(speedPerDay)) {
                alert("Please enter valid numbers.");
                return;
            }

            if (totalPages <= 0) {
                alert("Total pages must be greater than 0.");
                return;
            }

            if (pagesRead < 0) {
                alert("Pages read cannot be negative.");
                return;
            }

            if (pagesRead > totalPages) {
                alert("Pages read cannot be more than total pages.");
                return;
            }

            if (speedPerDay <= 0) {
                alert("Reading speed must be greater than 0.");
                return;
            }

            let trackerData = {
                pagesRead: pagesRead,
                totalPages: totalPages,
                speedPerDay: speedPerDay,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem("readifyTrackerProgress", JSON.stringify(trackerData));

            updateProgressUI(pagesRead, totalPages, speedPerDay);
            alert("Progress updated!");
        });
    }

    loadSavedProgress();
}



/* ============================
   Recommender Page
============================ */

function setupRecommenderPage() {
    let selectGenre = document.getElementById("reco-genre");
    let selectLength = document.getElementById("reco-length");
    let btnRecommend = document.getElementsByClassName("reco-phrase-btn")[0];

    let recoCard = document.getElementsByClassName("reco-card")[0];

    if (!selectGenre || !selectLength || !btnRecommend || !recoCard) {
        return;
    }

    let titleText = recoCard.getElementsByClassName("reco-title")[0];
    let authorText = recoCard.getElementsByClassName("reco-author")[0];
    let descText = recoCard.getElementsByClassName("reco-desc")[0];
    let ratingText = recoCard.getElementsByClassName("reco-rating")[0];
    let coverBox = recoCard.getElementsByClassName("reco-cover")[0];

    let actionsWrap = recoCard.getElementsByClassName("reco-actions")[0];
    let btnSave = actionsWrap ? actionsWrap.getElementsByTagName("button")[0] : null;
    let btnAnother = actionsWrap ? actionsWrap.getElementsByTagName("button")[1] : null;

    let currentRecommendedBook = null;

    function fillGenreDropdown() {
        let genres = getBookGenresOnly();

        selectGenre.innerHTML = "";

        let anyOption = document.createElement("option");
        anyOption.value = "";
        anyOption.innerText = "Any";
        selectGenre.appendChild(anyOption);

        for (let i = 0; i < genres.length; i++) {
            let opt = document.createElement("option");
            opt.value = genres[i];
            opt.innerText = genres[i];
            selectGenre.appendChild(opt);
        }
    }

    function getStars(ratingNumber) {
        let filled = Math.round(ratingNumber);

        if (filled < 0) filled = 0;
        if (filled > 5) filled = 5;

        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += (i < filled) ? "★ " : "☆ ";
        }

        return stars.trim();
    }

    function matchesRecommenderFilters(bookItem) {
        let genreValue = selectGenre.value.trim();
        let lengthValue = selectLength.value.trim();

        let genreOk = (genreValue === "") || ((bookItem.genre || "") === genreValue);

        let pages = Number(bookItem.pages || 0);
        let lengthOk = true;

        if (lengthValue === "short") {
            lengthOk = pages > 0 && pages <= 250;
        } else if (lengthValue === "medium") {
            lengthOk = pages > 250 && pages <= 450;
        } else if (lengthValue === "long") {
            lengthOk = pages > 450;
        }

        return genreOk && lengthOk;
    }

    function pickRandomBook() {
        let matches = [];

        for (let i = 0; i < booksList.length; i++) {
            if (matchesRecommenderFilters(booksList[i])) {
                matches.push(booksList[i]);
            }
        }

        if (matches.length === 0) {
            return null;
        }

        let randomIndex = Math.floor(Math.random() * matches.length);
        return matches[randomIndex];
    }

    function showRecommendation(bookItem) {
        currentRecommendedBook = bookItem;

        if (!bookItem) {
            titleText.innerText = "No match found";
            authorText.innerText = "";
            descText.innerText = "Try changing the filters.";
            ratingText.innerText = "☆ ☆ ☆ ☆ ☆";

            if (coverBox) {
                coverBox.innerHTML = "Book Cover";
            }
            return;
        }

        titleText.innerText = bookItem.title;
        authorText.innerText = bookItem.author;
        descText.innerText = bookItem.description || bookItem.synopsis || "";

        // UPDATED: show avg rating from reviews
        ratingText.innerText = getStars(getBookRatingNumber(bookItem));

        if (coverBox) {
            coverBox.innerHTML = "";

            let img = document.createElement("img");
            img.src = bookItem.cover || "assets/images/books/sample1.jpg";
            img.alt = bookItem.title + " cover";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.borderRadius = "1rem";
            img.style.display = "block";

            coverBox.appendChild(img);
        }
    }

    btnRecommend.addEventListener("click", function () {
        showRecommendation(pickRandomBook());
    });

    if (btnAnother) {
        btnAnother.addEventListener("click", function () {
            showRecommendation(pickRandomBook());
        });
    }

    if (btnSave) {
        btnSave.addEventListener("click", function () {
            if (!currentRecommendedBook) {
                alert("Nothing to save yet.");
                return;
            }

            let savedBooks = getSavedArray("readifySavedRecommendations");

            for (let i = 0; i < savedBooks.length; i++) {
                if (savedBooks[i].id === currentRecommendedBook.id) {
                    alert("Already saved.");
                    return;
                }
            }

            savedBooks.push(currentRecommendedBook);
            saveArray("readifySavedRecommendations", savedBooks);

            alert("Saved to your list!");
        });
    }

    fillGenreDropdown();
    showRecommendation(pickRandomBook());
}


/* ============================
   Reading Flow Page (Completed Books)
============================ */

function setupReadingFlowBooks() {
    let grid = document.getElementsByClassName("flow-book-grid")[0];

    if (!grid) {
        return;
    }

    let completedIds = getCompletedBooksList();

    grid.innerHTML = "";

    let shown = 0;

    for (let i = 0; i < completedIds.length; i++) {
        if (shown >= 3) break;

        let book = findBookById(completedIds[i]);
        if (!book) continue;

        let card = document.createElement("article");
        card.className = "book-card";

        let coverBox = document.createElement("div");
        coverBox.className = "book-cover";

        let coverImg = document.createElement("img");
        coverImg.src = book.cover || "assets/images/books/sample1.jpg";
        coverImg.alt = (book.title || "Book") + " cover";
        coverImg.style.width = "100%";
        coverImg.style.height = "100%";
        coverImg.style.objectFit = "cover";
        coverImg.style.display = "block";

        coverBox.appendChild(coverImg);

        let infoBox = document.createElement("div");
        infoBox.className = "book-info";

        let titleText = document.createElement("h3");
        titleText.className = "book-title";
        titleText.innerText = book.title || "Book Title";

        let authorText = document.createElement("p");
        authorText.className = "book-author";
        authorText.innerText = book.author || "Author Name";

        infoBox.appendChild(titleText);
        infoBox.appendChild(authorText);

        card.appendChild(coverBox);
        card.appendChild(infoBox);

        // optional: open modal when clicking
        card.addEventListener("click", function () {
            openBookDetailsModal(book);
        });

        grid.appendChild(card);
        shown++;
    }

    if (shown === 0) {
        let msg = document.createElement("p");
        msg.innerText = "No completed books yet. Mark a book as completed in Explorer.";
        grid.appendChild(msg);
    }
}


/* ============================
   Reading Flow Page (Audio)
============================ */

function setupReadingFlowAudio() {
    let soundButtons = document.getElementsByClassName("sound-card");

    if (soundButtons.length === 0) {
        return;
    }

    let soundPaths = {
        forest: "assets/audio/forest.mp3",
        rain: "assets/audio/rain.mp3",
        waves: "assets/audio/waves.mp3"
    };

    let currentAudio = null;
    let currentSoundName = "";

    function stopAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        for (let i = 0; i < soundButtons.length; i++) {
            soundButtons[i].classList.remove("is-playing");
            soundButtons[i].setAttribute("aria-pressed", "false");
        }

        currentAudio = null;
        currentSoundName = "";
    }

    function playAudio(soundName, buttonElement) {
        stopAudio();

        let filePath = soundPaths[soundName];

        if (!filePath) {
            alert("Audio file not set for: " + soundName);
            return;
        }

        currentAudio = new Audio(filePath);
        currentSoundName = soundName;

        currentAudio.loop = true;
        currentAudio.play();

        buttonElement.classList.add("is-playing");
        buttonElement.setAttribute("aria-pressed", "true");
    }

    for (let i = 0; i < soundButtons.length; i++) {
        soundButtons[i].addEventListener("click", function () {
            let soundName = soundButtons[i].getAttribute("data-sound");

            if (currentSoundName === soundName && currentAudio) {
                stopAudio();
                return;
            }

            playAudio(soundName, soundButtons[i]);
        });
    }
}


/* ============================
   Feedback Page
============================ */

function setupFeedbackPage() {
    let feedbackForm = document.getElementsByClassName("feedback-form")[0];

    if (!feedbackForm) {
        return;
    }

    let txtName = document.getElementById("fb-name");
    let txtEmail = document.getElementById("fb-email");
    let txtMessage = document.getElementById("fb-message");

    let confirmText = document.createElement("p");
    confirmText.style.marginTop = "0.8rem";
    confirmText.style.fontWeight = "700";
    confirmText.style.display = "none";
    feedbackForm.appendChild(confirmText);

    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = txtName.value.trim();
        let email = txtEmail.value.trim();
        let message = txtMessage.value.trim();

        if (name === "" || email === "" || message === "") {
            alert("Please fill all fields.");
            return;
        }

        let feedbackList = getSavedArray("readifyFeedbackMessages");

        let newFeedback = {
            name: name,
            email: email,
            message: message,
            submittedAt: new Date().toISOString()
        };

        feedbackList.push(newFeedback);
        saveArray("readifyFeedbackMessages", feedbackList);

        confirmText.innerText = "Thanks! Your feedback was saved.";
        confirmText.style.display = "block";

        txtName.value = "";
        txtEmail.value = "";
        txtMessage.value = "";
    });

    let faqItems = document.getElementsByClassName("faq-item");

    function updateChevron(item) {
        let icon = item.getElementsByClassName("faq-chevron")[0];
        if (!icon) return;

        if (item.open) {
            icon.style.transform = "rotate(180deg)";
        } else {
            icon.style.transform = "rotate(0deg)";
        }
    }

    for (let i = 0; i < faqItems.length; i++) {
        updateChevron(faqItems[i]);

        faqItems[i].addEventListener("toggle", function () {
            updateChevron(faqItems[i]);
        });
    }
}


/* ============================
   Initialise everything
============================ */

function initialiseReadify() {
    setupMobileNavbar();
    setupNewsletterForm();

    setupHeroQuoteRotation();
    setupAuthorOfTheDay();

    setupTrackerPage();
    setupReadingFlowAudio();
    setupFeedbackPage();

    let hasExplorerPage = document.getElementsByClassName("book-grid").length > 0;
    let hasRecommenderPage = document.getElementsByClassName("reco-card").length > 0;
    let hasReadingFlowPage = document.getElementsByClassName("flow-book-grid").length > 0;

    if (hasExplorerPage || hasRecommenderPage || hasReadingFlowPage) {
        loadBooksData(function () {
            if (hasExplorerPage) {
                setupExplorerPage();
            }

            if (hasRecommenderPage) {
                setupRecommenderPage();
            }

            if (hasReadingFlowPage) {
                setupReadingFlowBooks();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initialiseReadify();
});
