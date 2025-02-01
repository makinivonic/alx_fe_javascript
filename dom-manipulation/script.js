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
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
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
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Update categories in dropdown
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added successfully!");
}

// Function to filter quotes
function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value); // Save selected category
  showRandomQuote(); // Show a random quote from the selected category
}

// Function to simulate server interaction
async function fetchServerQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Simulated server data
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({ text: quote.title, category: "General" })); // Simplified structure
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}

// Function to sync data with the server and resolve conflicts
async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();

  if (serverQuotes.length === 0) {
    return;
  }

  // Check for conflicts by comparing local quotes and server quotes
  let conflictDetected = false;

  serverQuotes.forEach(serverQuote => {
    const existingQuote = quotes.find(quote => quote.text === serverQuote.text);

    if (!existingQuote) {
      // New quote from the server, add it
      quotes.push(serverQuote);
      conflictDetected = true;
    }
  });

  if (conflictDetected) {
    saveQuotes();
    conflictNotification.style.display = "block"; // Notify the user about the conflict
  }
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);

// Conflict resolution notification click
conflictNotification.addEventListener("click", () => {
  // You can add more detailed conflict resolution logic here
  alert("Manually resolve the conflict if needed.");
  conflictNotification.style.display = "none";
});

// Initialize app
populateCategories();
showRandomQuote();

// Sync quotes every 10 seconds
setInterval(syncWithServer, 10000);
