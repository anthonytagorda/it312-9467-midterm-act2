const categorySelector = document.getElementById('category');
const placesList = document.getElementById('places-list');
const apiKey = '5aa4bbc3a35d4f24a9539fd819bfcf50';

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

categorySelector.addEventListener('change', () => {
    // Get selected categories
    const selectedCategories = Array.from(categorySelector.selectedOptions, option => option.value);

    // Construct API URL based on selected categories
    const apiUrl = `https://api.geoapify.com/v2/places?categories=${selectedCategories.join(',')}&filter=place:51482915cd16265e4059e735029a78663040f00101f90159cdd40000000000c0020992030642616775696f&limit=20&apiKey=${apiKey}`;

    // Fetch data from the API
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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// Show or hide the "Back to Top" button based on the scroll position
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});