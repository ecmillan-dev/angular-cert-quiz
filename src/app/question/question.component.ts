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


    const questionChange = changes['hasChangedQuestion'];
    if (questionChange) {
      this.hasChangedQuestion = questionChange.currentValue;
    }
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
