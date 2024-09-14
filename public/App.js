const carouselItems = document.getElementById('carouselItems');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentIndex = 0;
const itemsToShow = 3; // Number of items to show at once

// Fetch featured recipes and display them
function fetchFeaturedRecipes() {
    const APP_ID = '27ec7fa6';
    const APP_KEY = '9fd4b9eedd2ba59f3764f6b2f316ac30';
    const url = `https://api.edamam.com/search?q=featured&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=10`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayFeaturedRecipes(data.hits);
        })
        .catch(error => {
            console.error('Error fetching featured recipes:', error);
        });
}

function displayFeaturedRecipes(recipes) {
    carouselItems.innerHTML = '';

    recipes.forEach(recipe => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        itemDiv.innerHTML = `
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <div class="recipe-details">
                <a href="${recipe.recipe.url}" target="_blank">${recipe.recipe.label}</a>
                <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
                <p>Ingredients: ${recipe.recipe.ingredientLines.length}</p>
            </div>
        `;
        carouselItems.appendChild(itemDiv);
    });

    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const itemWidth = items[0].offsetWidth;
    const containerWidth = document.querySelector('.carousel-container').offsetWidth;

    // Adjust the number of items to show
    const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;

    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            carouselItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            carouselItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    });
}

// Initialize
fetchFeaturedRecipes();
