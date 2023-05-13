import QuestionBlock from './class.js';
import apiKey from './ApiKey.js';

// let apiKey = process.env.OPENAI_API_KEY;
// const {QuestionBlock} = require('./class')
let latitude = "";
let longitude = "";
let score = 0;

// const configuration = new Configuration({
//     organization: "org-TqEpdlmkfsBxbmm8zCNbwlWm",
//     apiKey: "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",
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
        const promptCities = "can you give me the 10 closest cities to " + latitude + " is my latitude and " + longitude + " is my longitude. Give me no words except for the city names seperated by commas starting with the closest cities to " + latitude + " is my latitude and " + longitude + " is my longitude"

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey, // Replace with your actual OpenAI API key
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ "role": "user", "content": promptCities }],
                max_tokens: 1000,
                temperature: 0,
            }),
        });

        const data = await response.json();
        console.log(data["choices"][0]["message"]["content"]);
    } catch (error) {
        console.error("Error getting coordinates:", error.message);
    }
}

async function makeQuestions() {
    const result = await updateCoordinates();
    latitude = result.latitude.toString();
    longitude = result.longitude.toString();
    const promptQuestions = "I am making a website that teaches users about their surrounding area by giving them quiz questions about their local cities and towns can you give me the 10 closest cities to " + latitude + " is my latitude and " + longitude + " is my longitude. After locating those cities please make me 10 quesitons that accomplish my goal here is an example question: Alice works in moreno valley, how far away of a drive from you is that? Then give me 4 multiple choice answers for each with only one of them being the correct choice. Put the * sign around the correct choice."
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey, // Replace with your actual OpenAI API key
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ "role": "user", "content": promptQuestions }],
            max_tokens: 1000,
            temperature: 0,
        }),
    });
    const data = await response.json();
    console.log(data["choices"][0]["message"]["content"]);
    const str = data["choices"][0]["message"]["content"];
    const arr = str.split("\n");
    console.log(arr);

    let objectArray = [10]

    for (let i = 0; i < 10; i++) {
        let question = arr[i * 6 + 15];
        let answers = [];
        for (let j = 1; j < 5; j++) {
            answers[j - 1] = arr[i * 6 + 15 + j];
        }
        let cityName = str.split("\n")[i + 2]; // get the first word of the question
        objectArray[i] = new QuestionBlock(question, answers, cityName);
        console.log('Created new QuestionBlock:', objectArray[i]);  // Log the new QuestionBlock
    }


    for (let index = 0; index < objectArray.length; index++) {
        console.log(objectArray[index]);

    }

    return objectArray;


    // for (i = 0; i < 10; i++) {
    //     objectArray[i] = new Object();
    //     objecetArray[i].setQuestion(str.substring(str.indexOf(" "), str.length + 1)) //str is arr[i * maxAnwers]
    //     for (j = 0; j < maxAnswers; j++) {
    //         objectArray[i].setAnswer(arr[i * j])
    //     }
    // }
}

let questions = [];

makeQuestions().then(result => {
    questions = result;
    updateQuestion(0);
});

let currentQuestionIndex = 0;

function updateQuestion(index) {
    const question = questions[index];
    document.querySelector(".questionBox h2").textContent = question.question;
    const answersBox = document.querySelector(".answersBox");
    answersBox.innerHTML = ''; // clear existing answers

    question.answers.forEach((answer, i) => {
        const p = document.createElement('p');
        p.textContent = answer;
        // Add a click event listener to each paragraph
        p.addEventListener('click', () => {
            if (question.answered) { // If the question has already been answered, do nothing
                return;
            }
            // Remove any existing color classes
            answersBox.querySelectorAll('p').forEach(el => {
                el.classList.remove('correct');
                el.classList.remove('incorrect');
            });
            // Add the correct color class
            if (i === question.correctAnswer) {
                p.classList.add('correct');
                question.correct = true;
                score++;  // increase the score
            } else {
                p.classList.add('incorrect');
                question.correct = false;
                // Also color the correct answer green
                answersBox.childNodes[question.correctAnswer].classList.add('correct');
            }
            question.answered = true;  // mark the question as answered
            answersBox.querySelectorAll('p').forEach(el => {
                el.classList.add('answered');
            });
            // Update the score display
            document.getElementById('score').textContent = `Score: ${score}/${currentQuestionIndex + 1}`;
        });
        answersBox.appendChild(p);
    });

    // Update progress bar
    let progress = document.getElementById('file');
    progress.max = questions.length;  // Set the max value to the total number of questions
    progress.value = index + 1;  // Set the current value to the current question number
}

document.querySelector("#next-question").addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion(currentQuestionIndex);
    }

    if (currentQuestionIndex === questions.length - 1) {
        // Hide the quiz screen and show the final page
        document.querySelector("#quiz-screen").style.display = 'none';
        document.querySelector("#final-screen").style.display = 'block';

        // Calculate the final score and display it
        document.querySelector("#final-score").textContent = `Your final score is: ${score}/10`;
    }
    let citiesList = document.querySelector("#cities-list");
    citiesList.innerHTML = '';  // Clear the list
    console.log('questions array:', questions);  // Log the questions array

    for (let i = 0; i < questions.length; i++) {
        let listItem = document.createElement('li');
        let cityName = questions[i].cityName;
        listItem.textContent = cityName;
        citiesList.appendChild(listItem);
    }
});




window.onload = function () {
    const loadingScreen = document.getElementById('loading-screen');
    const playScreen = document.getElementById('play-screen');
    const quizScreen = document.getElementById('quiz-screen');

    // Show the loading screen
    loadingScreen.style.display = 'block';

    // Start the countdown
    let timer = 90;
    const timerElement = document.getElementById('timer');
    const countdown = setInterval(function () {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            loadingScreen.style.display = 'none';
            playScreen.style.display = 'block';
        }
    }, 1000);

    // When the Play button is clicked, hide the play screen and show the quiz
    document.getElementById('play-button').addEventListener('click', function () {
        playScreen.style.display = 'none';
        quizScreen.style.display = 'block';
    });

    // Fetch your questions here
    makeQuestions().then(result => {
        questions = result;
        updateQuestion(0);
    });
};

// Populate the list of cities



getCoordinates();
// makeQuestions();

document.getElementById('restart-button').addEventListener('click', function () {
    location.reload();
});