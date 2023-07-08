import { Component, OnDestroy } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, of, distinct, mergeMap, toArray, from } from 'rxjs';
import { QuizService } from '../quiz.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent {
  fullCategories$: Observable<Category[]>;

  categories: Category[] = [];
  subcategories: Category[] = [];
  searchSubcategories: Category[] = [];

  questions$!: Observable<Question[]>;

  hideDropdown: boolean = false;
  hideSubCategoryDropdown: boolean = false;

  form: FormGroup;

  categoryId: string = '';

  constructor(protected quizService: QuizService, private formBuilder: FormBuilder) {
    this.fullCategories$ = quizService.getAllCategories();

    this.form = this.formBuilder.group({
      Category: new FormControl(),
      SubCategory: new FormControl(),
      Difficulty: new FormControl({ value: 'Select difficulty', disabled: false })
    })
    // this.categories$.subscribe(result => console.log(result));

    this.fullCategories$.subscribe((categories) => {
      categories.forEach((c) => {
        const categoryParts = c.name.split(':');
        if (!this.categories.find((sc) => sc.name === categoryParts[0])) {
          const cat = { ...c };
          cat.name = categoryParts[0].trim();
          this.categories.push(cat);
        }

        // try add to subcategory
        if (categoryParts.length === 2) {
          if (!this.subcategories.find((sc) => sc.name === categoryParts[1])) {
            const cat = { ...c };
            cat.name = categoryParts[1].trim();
            cat.parentId = this.categories.find(
              (c) => c.name === categoryParts[0].trim()
            )?.id;
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

    this.form.get('Category')?.valueChanges.subscribe(category => {

      console.log(category);
    })
  }

  setSubcategories(cat: any): void {
    console.log(cat);
    this.searchSubcategories = this.subcategories.filter(
      (sc) => sc.parentId === this.categories.find(c => c.name === cat.target.value)?.id
    );
    this.hideSubCategoryDropdown = false;
  }

  createQuiz(): void {
    const vals = this.form.value;
    console.log('asdflkjasdlfk', vals);


    const catstring = (vals.SubCategory ?? vals.Category).toString() ?? '';


    this.fullCategories$.subscribe((categories) => {
      console.log(categories);
      const cat = categories.find(c => c.name.toLocaleLowerCase() === catstring.toLocaleLowerCase())?.id?.toString() ?? '';
      this.questions$ = this.quizService.createQuiz(
        cat,
        vals.Difficulty as Difficulty,
        5
      );
    });

  }

  onCategory(event: any) {
    console.log('key', event);
    this.hideDropdown = false;
    this.hideSubCategoryDropdown = true;
    this.form.get('SubCategory')?.patchValue('');
  }

  onSubCategory(event: any) {
    console.log('key', event);
    this.hideSubCategoryDropdown = false;
  }

  onChoice(event: any) {
    console.log('selection', event); // this is it
    this.hideDropdown = true;
    this.form.get('Category')?.patchValue(event.name);
    this.form.get('SubCategory')?.patchValue('');
    this.categoryId = event.id;
    console.log('subcats', this.subcategories);
    this.searchSubcategories = this.subcategories.filter(
      (sc) => sc.parentId === event.id
    );
    console.log(this.searchSubcategories);
  }

  onSubcatChoice(event: any) {
    this.form.get('SubCategory')?.patchValue(event.name);
    this.categoryId = event.id;
    this.hideSubCategoryDropdown = true;
  }
}
