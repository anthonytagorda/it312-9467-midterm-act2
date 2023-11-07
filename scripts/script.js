const categorySelector = document.getElementById('category');
const placesList = document.getElementById('places-list');
const apiKey = '5aa4bbc3a35d4f24a9539fd819bfcf50';

const tabsBox = document.querySelector(".tabs-box"),
allTabs = tabsBox.querySelectorAll(".tab"),
arrowIcons = document.querySelectorAll(".icon i");

let isDragging = false;

const handleIcons = (scrollVal) => {
    let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
    arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
    arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
}

// Function for Scrolling Left and Right
arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        // if clicked icon is left, reduce 350 from tabsBox scrollLeft else add
        let scrollWidth = tabsBox.scrollLeft += icon.id === "left" ? -340 : 340;
        handleIcons(scrollWidth);
    });
});

allTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabsBox.querySelector(".active").classList.remove("active");
        tab.classList.add("active");
    });
});

// Function for Dragging
const dragging = (e) => {
    if(!isDragging) return;
    tabsBox.classList.add("dragging");
    tabsBox.scrollLeft -= e.movementX;
    handleIcons(tabsBox.scrollLeft)
}

const dragStop = () => {
    isDragging = false;
    tabsBox.classList.remove("dragging");
}

tabsBox.addEventListener("mousedown", () => isDragging = true);
tabsBox.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

// Function to scroll to the top of the page
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

// Create and append the "Back to Top" button
const backToTopButton = document.createElement('div');
backToTopButton.id = 'back-to-top-button';
backToTopButton.innerHTML = '<a href="#top">Back to Top</a>';
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', scrollToTop);

// Function to fetch data based on selected categories and update placesList
function fetchData(selectedCategories) {
    const apiUrl = `https://api.geoapify.com/v2/places?categories=${selectedCategories.join(',')}&filter=place:51482915cd16265e4059e735029a78663040f00101f90159cdd40000000000c0020992030642616775696f&limit=20&apiKey=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Clear the places list
            placesList.innerHTML = '';

            // Iterate through the fetched data and display it
            data.features.forEach(place => {
                const properties = place.properties;
                const raw = properties.datasource.raw;

                placesList.innerHTML += `
                    <div class="place">
                        <h3>${properties.name || 'N/A'}</h3>
                        <p>Address: ${properties.formatted || 'N/A'}</p>
                        <p>Email: ${raw['contact:email'] || 'N/A'}</p>
                        <p>Phone: ${raw['contact:phone'] || 'N/A'}</p>
                        <p>Mobile: ${raw['contact:mobile'] || 'N/A'}</p>
                        <p>Website: ${raw['contact:website'] || 'N/A'}</p>
                        <p>Facebook: ${raw['contact:facebook'] || 'N/A'}</p>
                        <p>Opening Hours: ${raw.opening_hours || 'N/A'}</p>
                        <p>Charge: ${raw.charge || 'N/A'}</p>
                    </div>
                `;
            });

            // Scroll to the first item
            if (data.features.length > 0) {
                scrollToItem(allTabs[0]);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


// Show or hide the "Back to Top" button based on the scroll position
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

