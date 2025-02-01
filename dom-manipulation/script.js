// Array to hold quotes and categories
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add a new one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];
  quoteDisplay.innerHTML = `${text} <span class="quote-category">(${category})</span>`;
}

// Function to add a new quote
function addQuote() {
  // Get the input elements by their IDs
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  // Clear input fields after adding the quote
  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added successfully!");
}

// Function to dynamically create the form for adding a new quote
function createAddQuoteForm() {
  // Create a container div for the form
  const formDiv = document.createElement("div");
  formDiv.id = "addQuoteForm";

  // Create input for new quote text
  const inputQuoteText = document.createElement("input");
  inputQuoteText.type = "text";
  inputQuoteText.id = "newQuoteText";
  inputQuoteText.placeholder = "Enter a new quote";

  // Create input for new quote category
  const inputQuoteCategory = document.createElement("input");
  inputQuoteCategory.type = "text";
  inputQuoteCategory.id = "newQuoteCategory";
  inputQuoteCategory.placeholder = "Enter quote category";

  // Create the Add Quote button
  const addQuoteBtn = document.createElement("button");
  addQuoteBtn.textContent = "Add Quote";
  addQuoteBtn.addEventListener("click", addQuote);

  // Append inputs and button to the form container
  formDiv.appendChild(inputQuoteText);
  formDiv.appendChild(inputQuoteCategory);
  formDiv.appendChild(addQuoteBtn);

  // Append the form container to the body (or another container element)
  document.body.appendChild(formDiv);
}

// Event listeners
newQuoteButton.addEventListener("click", showRandomQuote);

// Call createAddQuoteForm to build the form when the page loads
createAddQuoteForm();
