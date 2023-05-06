
let latitude = "";
let longitude = "";

// const configuration = new Configuration({
//     organization: "org-TqEpdlmkfsBxbmm8zCNbwlWm",
//     apiKey: "sk-",
// });
// const openai = new OpenAIApi(configuration);


function updateCoordinates() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            // Request the current location
            navigator.geolocation.getCurrentPosition(
                // Success callback
                function (position) {
                    // Get latitude and longitude
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                // Error callback
                function (error) {
                    console.error("Error getting location:", error.message);
                    reject(error);
                }
            );
        } else {
            console.error("Geolocation is not supported by your browser.");
            reject(new Error("Geolocation is not supported by your browser."));
        }
    });
}

async function getCoordinates() {
    try {
        const result = await updateCoordinates();
        latitude = result.latitude.toString();
        longitude = result.longitude.toString();
        console.log(latitude + " is my latitude" + " and " + longitude + " is my longitude");
        const promptCities = "can you give me the 100 closest cities to " + latitude + " is my latitude and " + longitude + " is my longitude. Give me no words except for the city names seperated by commas starting with the closest cities to " + latitude + " is my latitude and " + longitude + " is my longitude"

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + "sk-", // Replace with your actual OpenAI API key
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ "role": "user", "content": promptCities }],
                max_tokens: 500,
                temperature: 0,
            }),
        });

        const data = await response.json();
        console.log(data["choices"][0]["message"]["content"]);
    } catch (error) {
        console.error("Error getting coordinates:", error.message);
    }
}


getCoordinates();
