const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const mapEl = document.getElementById('map');

const geonamesUsername = 'hotredsam';
const openaiApiKey = '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';

// Helper function to fetch GPT-4 response
async function fetchGpt4Response(prompt) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.7,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

// Get user's location
navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(lon);

    // Fetch 100 closest cities
    const citiesUrl = `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&cities=cities1000&maxRows=100&radius=300username=${geonamesUsername}`;
    const citiesResponse = await fetch(citiesUrl);
    const citiesData = await citiesResponse.json();

    console.log(citiesResponse);

    const cities = citiesData.geonames;
    if (!cities || cities.length === 0) {
        console.error('No cities found');
        return;
    }

    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    // Generate GPT-4 question
    const questionPrompt = `Generate a fictional scenario trivia question involving the city of ${randomCity.name}, ${randomCity.countryCode}, and its distance from the user's location at latitude ${lat} and longitude ${lon}.`;
    const questionText = await fetchGpt4Response(questionPrompt);

    questionEl.textContent = questionText;

    // Generate GPT-4 multiple choice options
    const optionsPrompt = `Generate 4 multiple choice options for the trivia question: "${questionText}"`;
    const optionsText = await fetchGpt4Response(optionsPrompt);

    const options = optionsText.split('\n').filter(option => option.trim());
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = async () => {
            // Check the answer using GPT-4
            const answerPrompt = `Is the answer "${option}" correct for the trivia question: "${questionText}"?`;
            const answerResult = await fetchGpt4Response(answerPrompt);
            resultEl.textContent = answerResult;

            // Display map with an overlay
            const map = L.map('map').setView([lat, lon], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            // Add markers for user's location and the random city
            L.marker([lat, lon]).addTo(map).bindPopup('Your location');
            L.marker([randomCity.lat, randomCity.lng]).addTo(map).bindPopup(`${randomCity.name}, ${randomCity.countryCode}`);

            // Add polyline between user's location and the random city
            const polyline = L.polyline([
                [lat, lon],
                [randomCity.lat, randomCity.lng],
            ], { color: 'red' }).addTo(map);
            // Add distance overlay
            const distance = map.distance([lat, lon], [randomCity.lat, randomCity.lng]);
            const distanceOverlay = L.control({ position: 'bottomleft' });
            distanceOverlay.onAdd = () => {
                const div = L.DomUtil.create('div', 'distance-overlay');
                div.innerHTML = `<strong>Distance:</strong> ${(distance / 1000).toFixed(1)} km`;
                return div;
            };
            distanceOverlay.addTo(map);
        };

        optionsEl.appendChild(button);

    });
});