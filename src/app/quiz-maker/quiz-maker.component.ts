import {Component, OnDestroy} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable, of, distinct, mergeMap, toArray, from} from 'rxjs';
import {QuizService} from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent  {
  fullCategories$: Observable<Category[]>;

  categories: Category[] = [];
  subcategories: Category[] = [];
  searchSubcategories: Category[] = [];

  questions$!: Observable<Question[]>;

  constructor(protected quizService: QuizService) {
    this.fullCategories$ = quizService.getAllCategories();
    // this.categories$.subscribe(result => console.log(result));

    this.fullCategories$.subscribe(categories => {
      categories.forEach(c => {
        const categoryParts = c.name.split(':');
        console.log(categoryParts);
        if (!this.categories.find(sc => sc.name === categoryParts[0])) {
          const cat = {...c};
          cat.name = categoryParts[0].trim();
          this.categories.push(cat);
        console.log(this.categories)        ;
      }

        // try add to subcategory
        if (categoryParts.length === 2) {
          if (!this.subcategories.find(sc => sc.name === categoryParts[1])) {
            const cat = {...c};
            cat.name = categoryParts[1].trim();
            cat.parentId = this.categories.find(c => c.name === categoryParts[0].trim())?.id;
            this.subcategories.push(cat);
          }
        }
      });
      console.log(this.categories, this.subcategories);

      // this.categories$ = of([...new Set(categories.map(c => {
      //   const categoryParts = c.name.split(':');
      //   c.name = c.name.substring(0, c.name.indexOf(':') === -1 ? c.name.length : c.name.indexOf(':'));
      //   return c;
      // }))]);
    });
    console.log(this.categories, this.subcategories);
  }

  setSubcategories(cat: any): void {
    this.searchSubcategories = this.subcategories.filter(sc => sc.parentId === parseFloat(cat.target.value));
  }


  createQuiz(cat: string, difficulty: string, subcat?: string): void {
    console.log('asdflkjasdlfk');
    console.log(cat);
    if (subcat) {
      console.log(subcat, cat);
    } else {
      console.log(cat);
    }
    const catstring = (subcat ?? cat).toString();
    console.log(catstring);
    this.questions$ = this.quizService.createQuiz(subcat && subcat !== '0' ? subcat : cat, difficulty as Difficulty);
  }
}
