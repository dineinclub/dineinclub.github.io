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

// Function to populate the dropdowns with unique Menu and Category values
function populateDropdowns(data) {
    const menuDropdown = document.getElementById("sort-by-menu");
    const categoryDropdown = document.getElementById("sort-by-category");

    // Clear existing options and add "NIL" as the default option
    menuDropdown.innerHTML = '<option value="NIL">NIL</option>';
    categoryDropdown.innerHTML = '<option value="NIL">NIL</option>';

    const menuNames = new Set();
    const categories = new Set();

    data.slice(1).forEach(row => {
        menuNames.add(row[0]);
        categories.add(row[2]);
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

    // Restore saved selections
    menuDropdown.value = localStorage.getItem("selectedMenu") || "NIL";
    categoryDropdown.value = localStorage.getItem("selectedCategory") || "NIL";
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

// Function to filter data based on selected Menu and Category
function applyFilters() {
    const selectedMenu = localStorage.getItem("selectedMenu") || "NIL";
    const selectedCategory = localStorage.getItem("selectedCategory") || "NIL";

    const filteredData = [menuData[0], ...menuData.slice(1).filter(row => {
        const matchesMenu = selectedMenu === "NIL" || row[0] === selectedMenu;
        const matchesCategory = selectedCategory === "NIL" || row[2] === selectedCategory;
        return matchesMenu && matchesCategory;
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
