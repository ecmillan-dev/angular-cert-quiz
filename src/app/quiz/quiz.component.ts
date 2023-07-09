import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Difficulty, Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnChanges {
  @Input()
  questions: Question[] | null = [];

  @Input() categoryId: string = '';

  userAnswers: string[] = [];
  hasUsedChange: boolean = false;
  quizService = inject(QuizService);
  router = inject(Router);

  ngOnChanges(changes: SimpleChanges): void {
    const questionChange = changes['questions'];
    if (questionChange) {
      this.hasUsedChange = false;
    }
  }

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }

  onQuestionChangeRequest(question: Question) {
    this.quizService
      .createQuiz(this.categoryId, question.difficulty as Difficulty, 1)
      .subscribe((newQuestion) => {
        this.hasUsedChange = true;
        const questionIndex =
          this.questions?.findIndex((q) => q.question === question.question) ??
          0;
        if (questionIndex >= 0 && this.questions) {
          this.questions.splice(questionIndex, 1, { ...newQuestion[0] });
        }
      });
  }
}
