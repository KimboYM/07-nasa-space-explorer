// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the Get Space Images button
const getImagesButton = document.querySelector('button');

// Find the gallery where images will be shown
const gallery = document.getElementById('gallery');

// Your NASA API key 
const apiKey = 'b2CsGCcO7dyz3OoTCya1p3gTbvKfTjWpeO1l0VKm';


// Fun space facts array
const spaceFacts = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "The footprints on the Moon will be there for millions of years.",
  "One million Earths could fit inside the Sun.",
  "Jupiter has 95 known moons as of 2025!",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Space is completely silent—there’s no air for sound to travel.",
  "The hottest planet in our solar system is Venus.",
  "Olympus Mons on Mars is the tallest volcano in the solar system."
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create the fact section and insert it above the gallery
const factSection = document.createElement('div');
factSection.className = 'space-fact alert alert-info text-center mb-3';
factSection.style.fontWeight = 'bold';
factSection.innerHTML = `🚀 <strong>Did You Know?</strong> ${randomFact}`;
const container = document.querySelector('.container');
container.insertBefore(factSection, gallery);

// Listen for clicks on the button
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL with the selected dates and API key
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message
  gallery.innerHTML = '<p>Loading images...</p>';

  // Fetch images from NASA's API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // If the API returns a single object, put it in an array
      const images = Array.isArray(data) ? data : [data];

      // Create HTML for each image or video as a Bootstrap card inside a responsive column
      const imagesHtml = '<div class="row g-4">' + images.map((item, idx) => {
        if (item.media_type === 'image') {
          return `
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card apod-image" data-idx="${idx}" style="cursor:pointer; height:100%;">
                <img src="${item.url}" class="card-img-top" alt="${item.title}" style="height:350px;object-fit:cover;" />
              </div>
            </div>
          `;
        } else if (item.media_type === 'video') {
          // For all videos, show a clear link in the card
          return `
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card apod-image" data-idx="${idx}" style="cursor:pointer; height:100%;">
                <div class="card-body text-center">
                  <a href="${item.url}" target="_blank" class="btn btn-primary">Watch Video</a>
                </div>
              </div>
            </div>
          `;
        }
      }).join('') + '</div>';

      // Show the images in the gallery
      gallery.innerHTML = imagesHtml;

      // Add click event to each card to show popup with details
      const cards = document.querySelectorAll('.apod-image.card');
      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          // Prevent link click from opening video immediately
          if (e.target.tagName === 'A') return;
          const idx = card.getAttribute('data-idx');
          showPopup(images[idx]);
        });
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
      console.error(error);
    });
});

// Helper function to create a popup
function showPopup(item) {
  // Create the popup background
  const popupBg = document.createElement('div');
  popupBg.style.position = 'fixed';
  popupBg.style.top = '0';
  popupBg.style.left = '0';
  popupBg.style.width = '100vw';
  popupBg.style.height = '100vh';
  popupBg.style.background = 'rgba(0,0,0,0.7)';
  popupBg.style.display = 'flex';
  popupBg.style.justifyContent = 'center';
  popupBg.style.alignItems = 'center';
  popupBg.style.zIndex = '1000';

  // Create the popup card
  const popupCard = document.createElement('div');
  popupCard.className = 'apod-popup';
  popupCard.style.background = '#fff';
  popupCard.style.padding = '20px';
  popupCard.style.borderRadius = '10px';
  popupCard.style.maxWidth = '500px';
  popupCard.style.width = '90%';
  popupCard.style.maxHeight = '90vh'; // Make sure it fits the screen
  popupCard.style.overflowY = 'auto'; // Scroll if content is too tall
  popupCard.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  popupCard.style.position = 'relative';
  popupCard.style.textAlign = 'center';

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.position = 'sticky';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.background = '#e74c3c';
  closeBtn.style.color = '#fff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '5px';
  closeBtn.style.padding = '5px 10px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.float = 'right';
  closeBtn.addEventListener('click', () => document.body.removeChild(popupBg));

  // Add content to the popup
  let popupContent = `
    <h2>${item.title}</h2>
    <p><strong>Date:</strong> ${item.date}</p>
  `;
  if (item.media_type === 'image') {
    popupContent += `<img src="${item.hdurl || item.url}" alt="${item.title}" style="max-width:100%;border-radius:8px;" />`;
  } else if (item.media_type === 'video') {
    // For all videos, show a clear link in the popup
    popupContent += `<a href="${item.url}" target="_blank" class="btn btn-primary">Watch Video</a>`;
  }
  popupContent += `<p style="margin-top:15px;">${item.explanation}</p>`;
  popupCard.innerHTML = popupContent;
  popupCard.appendChild(closeBtn);
  popupBg.appendChild(popupCard);
  document.body.appendChild(popupBg);
}
