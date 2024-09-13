const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const recipeResults = document.getElementById('recipeResults');
const loader = document.getElementById('loader');
const suggestions = document.getElementById('suggestions');
let typingTimer;
const typingInterval = 1000; // 1-second delay for real-time search
const searchHistory = document.getElementById('searchHistory');
const historyList = document.getElementById('historyList');

// API Credentials
const APP_ID = '27ec7fa6';
const APP_KEY = '9fd4b9eedd2ba59f3764f6b2f316ac30';

// Listen for input event to trigger real-time search
searchInput.addEventListener('input', () => {
    clearTimeout(typingTimer); // Clear previous timer
    typingTimer = setTimeout(() => {
        const query = searchInput.value;
        if (query) {
            getSuggestions(query); // Fetch suggestions
            getRecipes(query); // Fetch recipes
        } else {
            suggestions.innerHTML = ''; // Clear suggestions when input is empty
            recipeResults.innerHTML = ''; // Clear previous results
        }
    }, typingInterval); // Delay before making the API call
});

// Function to add a search term to history
function addToHistory(query) {
    const listItem = document.createElement('li');
    listItem.textContent = query;
    listItem.addEventListener('click', () => {
        searchInput.value = query;
        getRecipes(query);
    });
    historyList.appendChild(listItem);
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        getRecipes(query);
        addToHistory(query); // Add query to history
    } else {
        alert('Please enter a recipe or ingredient.');
    }
});

// Show loader while fetching recipes
function showLoader() {
    loader.style.display = 'block';
}

// Hide loader after fetching
function hideLoader() {
    loader.style.display = 'none';
}

// Function to get recipe suggestions from API
function getSuggestions(query) {
    const url = `https://api.edamam.com/auto-complete?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displaySuggestions(data);
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}

// Function to display recipe suggestions
function displaySuggestions(suggestionsList) {
    suggestions.innerHTML = ''; // Clear previous suggestions

    if (suggestionsList.length === 0) {
        return;
    }

    suggestionsList.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion;
            getRecipes(suggestion);
            suggestions.innerHTML = ''; // Clear suggestions
        });

        suggestions.appendChild(suggestionItem);
    });
}

// Function to get recipes from API
function getRecipes(query) {
    const url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=10`;

    showLoader(); // Show loader
    const feedback = document.getElementById('searchFeedback');
    feedback.textContent = 'Searching for recipes...';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoader(); // Hide loader
            feedback.textContent = ''; // Clear feedback
            displayRecipes(data.hits);
        })
        .catch(error => {
            hideLoader(); // Hide loader on error
            feedback.textContent = 'An error occurred while fetching recipes. Please try again.';
            console.error('Error fetching recipes:', error);
        });
}

// Function to display recipes in the DOM
function displayRecipes(recipes) {
    recipeResults.innerHTML = ''; // Clear previous results
    const feedback = document.getElementById('searchFeedback');

    if (recipes.length === 0) {
        feedback.textContent = 'No recipes found. Please try a different search term.';
    } else {
        feedback.textContent = ''; // Clear feedback if recipes are found

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            recipeDiv.innerHTML = `
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                <div class="recipe-details">
                    <a href="${recipe.recipe.url}" target="_blank">${recipe.recipe.label}</a>
                    <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
                    <p>Ingredients: ${recipe.recipe.ingredientLines.length}</p>
                </div>
            `;

            recipeResults.appendChild(recipeDiv);

            // Trigger the transition effect
            setTimeout(() => {
                recipeDiv.classList.add('show');
            }, 10); // Delay to ensure the class is added after the element is in the DOM
        });
    }
}
