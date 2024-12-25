const sheetID = "1vWALcbzq-Fngsb_eUme0gsUE0Yo-lAvCC7NBYdia6R4";
const sheetName = "Sheet1";
const apiKey = "AIzaSyANAk8EviyHaIPEul8o1a0mU_3nIaQyRp0";
const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

let menuData = []; // This will hold the fetched data

// Function to fetch data from Google Sheets
async function fetchMenuData() {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        menuData = data.values;
        populateDropdowns(menuData);
        applyFilters(); // Display menu based on selected filters on load
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateDropdowns(data) {
    const menuDropdown = document.getElementById("sort-by-menu");
    const categoryDropdown = document.getElementById("sort-by-category");
    const cuisineDropdown = document.getElementById("sort-by-cuisine");
    const dietDropdown = document.getElementById("sort-by-diet");

    // Clear existing options and add "NIL" as the default option
    menuDropdown.innerHTML = '<option value="NIL">NIL</option>';
    categoryDropdown.innerHTML = '<option value="NIL">NIL</option>';
    cuisineDropdown.innerHTML = '<option value="NIL">NIL</option>';
    dietDropdown.innerHTML = '<option value="NIL">NIL</option>';

    const menuNames = new Set();
    const categories = new Set();
    const cuisines = new Set();
    const diets = new Set();

    data.slice(1).forEach(row => {
        menuNames.add(row[0]);
        categories.add(row[2]);
        cuisines.add(row[8]); // Assuming "Cuisine" is at index 8
        diets.add(row[9]);    // Assuming "Diet" is at index 9
    });

    // Populate dropdowns
    menuNames.forEach(menuName => {
        const option = document.createElement("option");
        option.value = menuName;
        option.textContent = menuName;
        menuDropdown.appendChild(option);
    });

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });

    cuisines.forEach(cuisine => {
        const option = document.createElement("option");
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineDropdown.appendChild(option);
    });

    diets.forEach(diet => {
        const option = document.createElement("option");
        option.value = diet;
        option.textContent = diet;
        dietDropdown.appendChild(option);
    });

    // Restore saved selections
    menuDropdown.value = localStorage.getItem("selectedMenu") || "NIL";
    categoryDropdown.value = localStorage.getItem("selectedCategory") || "NIL";
    cuisineDropdown.value = localStorage.getItem("selectedCuisine") || "NIL";
    dietDropdown.value = localStorage.getItem("selectedDiet") || "NIL";
}


// Function to display menu items based on current filters
function displayMenu(filteredData) {
    const menuSection = document.getElementById("menu-section");
    menuSection.innerHTML = "";

    filteredData.slice(1).forEach(row => {
        const [menuName, timeSlot, category, itemName, price, description, imageUrl, availability] = row;
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");

        const availabilityClass = availability === "Available" ? "available" : "not-available";

        menuItem.innerHTML = `
            <img src="${imageUrl}" alt="${itemName}">
            <h3>${itemName}</h3>
            <p>${description}</p>
            <p><strong>Price:</strong> ₹${price}</p>
            <p class="availability ${availabilityClass}"><strong>Availability:</strong> ${availability}</p>
            <p><strong>Menu:</strong> ${menuName}</p>
            <p><strong>Serving Time:</strong> ${timeSlot}</p>
            <p><strong>Category:</strong> ${category}</p>
        `;
        menuSection.appendChild(menuItem);
    });
}

function applyFilters() {
    const selectedMenu = localStorage.getItem("selectedMenu") || "NIL";
    const selectedCategory = localStorage.getItem("selectedCategory") || "NIL";
    const selectedCuisine = localStorage.getItem("selectedCuisine") || "NIL";
    const selectedDiet = localStorage.getItem("selectedDiet") || "NIL";

    const filteredData = [menuData[0], ...menuData.slice(1).filter(row => {
        const matchesMenu = selectedMenu === "NIL" || row[0] === selectedMenu;
        const matchesCategory = selectedCategory === "NIL" || row[2] === selectedCategory;
        const matchesCuisine = selectedCuisine === "NIL" || row[8] === selectedCuisine; // Assuming index 8
        const matchesDiet = selectedDiet === "NIL" || row[9] === selectedDiet; // Assuming index 9
        return matchesMenu && matchesCategory && matchesCuisine && matchesDiet;
    })];

    displayMenu(filteredData);
}

// Event listeners for dropdowns
document.getElementById("sort-by-menu").addEventListener("change", (e) => {
    const selectedMenu = e.target.value;
    localStorage.setItem("selectedMenu", selectedMenu); // Save selected menu
    applyFilters();
});

document.getElementById("sort-by-category").addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save selected category
    applyFilters();
});

document.getElementById("sort-by-cuisine").addEventListener("change", (e) => {
    const selectedCuisine = e.target.value;
    localStorage.setItem("selectedCuisine", selectedCuisine); // Save selected cuisine
    applyFilters();
});

document.getElementById("sort-by-diet").addEventListener("change", (e) => {
    const selectedDiet = e.target.value;
    localStorage.setItem("selectedDiet", selectedDiet); // Save selected diet
    applyFilters();
});


// Fetch data and start auto-refresh when page loads
window.onload = () => {
    fetchMenuData();
    autoRefresh();
};


const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");
    localStorage.setItem("theme", document.body.classList.contains("theme-dark") ? "dark" : "light");
});

// Set initial theme based on saved preference
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("theme-dark");
    }
    fetchMenuData();
});
