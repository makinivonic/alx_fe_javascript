// Array to hold quotes and categories
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteButton");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categoryFilter = document.getElementById("categoryFilter");
const conflictNotification = document.getElementById("conflictNotification");

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate category dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Function to display a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `${text} <span class="quote-category">(${category})</span>`;
}

// Function to add a new quote
async function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added successfully!");

  await syncQuotes(newQuote); // Sync the new quote to the server
}

// Function to filter quotes
function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({ text: quote.title, category: "General" }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Function to sync quotes with the server
async function syncQuotes(newQuote) {
  try {
    await fetch("https://example.com/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuote)
    });
  } catch (error) {
    console.error("Error syncing quote to server:", error);
  }
}

// Function to sync data with the server and resolve conflicts
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length === 0) {
    return;
  }

  let conflictDetected = false;

  serverQuotes.forEach(serverQuote => {
    const existingQuote = quotes.find(quote => quote.text === serverQuote.text);

    if (!existingQuote) {
      quotes.push(serverQuote);
      conflictDetected = true;
    }
  });

  if (conflictDetected) {
    saveQuotes();
    conflictNotification.style.display = "block";
  }

  // Add this line to notify the user that quotes are synced with the server
  alert("Quotes synced with server!");  // This will show the required message
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
conflictNotification.addEventListener("click", () => {
  alert("Manually resolve the conflict if needed.");
  conflictNotification.style.display = "none";
});

// Initialize app
populateCategories();
showRandomQuote();
setInterval(syncWithServer, 10000);
