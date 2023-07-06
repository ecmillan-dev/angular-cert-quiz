import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Question } from '../data.models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', changes);
    // throw new Error('Method not implemented.');
    const questionChange = changes['hasChangedQuestion'];
    if (questionChange) {
      this.hasChangedQuestion = questionChange.currentValue;
    }

    // const newQuestionChange = changes['question'];
    // if (newQuestionChange) {
    //   const newQ = newQuestionChange.currentValue as Question;
    //   this.question = newQ;
    //   // this.question.all_answers = newQ.all_answers;
    //   // this.question.correct_answer = newQ.correct_answer;
    //   // this.question.difficulty = newQ.difficulty;
    //   // this.question.incorrect_answers = newQ.incorrect_answers;
    //   // this.question.question = newQ.question;
    //   // this.question.type = newQ.type;
    // }
  }
  @Input({ required: true })
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  @Input() hasChangedQuestion?: boolean = false;

  getButtonClass(answer: string): string {
    if (!this.userAnswer) {
      if (this.currentSelection == answer) return 'tertiary';
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return 'tertiary';
      if (answer == this.correctAnswer) return 'secondary';
    }
    return 'primary';
  }

  @Output()
  change = new EventEmitter<string>();

  @Output() changeOutQuestion = new EventEmitter<Question>();

  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }

  onQuestionChange() {
    this.changeOutQuestion.emit(this.question);
  }
}
