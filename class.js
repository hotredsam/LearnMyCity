export default class QuestionBlock {
  constructor(question, answers, correctAnswer) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
  }
  correctAnswer() {
    const date = new Date();
    return date.getFullYear() - this.year;
  }
}
