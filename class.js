export default class QuestionBlock {
  constructor(question, answers, cityName) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = -1; // Initialize to -1 to denote no correct answer found yet
    this.correct = false; // Initialize to false, as the question has not been answered yet
    this.answered = false; // Initialize to false, as the question has not been answered yet
    this.cityName = cityName;  // Now it's defined in the scope of the constructor
    console.log('cityName:', cityName);  // Log the cityName when a new QuestionBlock is created

    for (let i = 0; i < answers.length; i++) {
      if (answers[i].indexOf("*") >= 0) {
        this.correctAnswer = i; // Found the correct answer, update the index
        this.answers[i] = answers[i].replace(/\*/g, ""); // Remove all asterisks from the answer
      }
    }
  }
}