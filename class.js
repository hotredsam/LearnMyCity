export default class QuestionBlock {
  constructor(question, answers) {
    this.question = question;
    this.answers = answers;
    for (let i = 0; i < answers.length; i++) {
      console.log("Checking answer:", answers[i]);
      if (answers[i].indexOf("*") > 0) {
        this.correctAnswer = answers[i];
        console.log("Found correct answer:", answers[i]);
      }
    }
  }
}
