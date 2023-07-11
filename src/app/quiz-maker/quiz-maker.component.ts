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

  hideDropdown: boolean = true;
  hideSubCategoryDropdown: boolean = true;

  form: FormGroup;

  categoryId: string = '';

  constructor(
    protected quizService: QuizService,
    private formBuilder: FormBuilder
  ) {
    this.fullCategories$ = quizService.getAllCategories();

    // init form
    this.form = this.formBuilder.group({
      Category: new FormControl(),
      SubCategory: new FormControl(),
      Difficulty: new FormControl({
        value: 'Select difficulty',
        disabled: false,
      }),
    });

    // parse the service result
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
    });
  }

  setSubcategories(cat: any): void {
    this.searchSubcategories = this.subcategories.filter(
      (sc) =>
        sc.parentId ===
        this.categories.find((c) => c.name === cat.target.value)?.id
    );
    this.hideSubCategoryDropdown = false;
  }

  createQuiz(): void {
    const vals = this.form.value;
    const catstring = (vals.SubCategory ?? vals.Category).toString() ?? '';

    this.fullCategories$.subscribe((categories) => {
      const cat =
        categories
          .find(
            (c) => c.name.toLocaleLowerCase() === catstring.toLocaleLowerCase()
          )
          ?.id?.toString() ?? '';
      this.questions$ = this.quizService.createQuiz(
        cat,
        vals.Difficulty as Difficulty,
        5
      );
    });
  }

  onCategory(event: any) {
    this.hideDropdown = false;
    this.hideSubCategoryDropdown = true;
    this.form.get('SubCategory')?.patchValue('');
  }

  onSubCategory(event: any) {
    this.hideSubCategoryDropdown = false;
  }

  onChoice(event: any) {
    this.hideDropdown = true;
    this.form.get('Category')?.patchValue(event.name);
    this.form.get('SubCategory')?.patchValue('');
    this.categoryId = event.id;
    this.searchSubcategories = this.subcategories.filter(
      (sc) => sc.parentId === event.id
    );
  }

  onSubcatChoice(event: any) {
    this.form.get('SubCategory')?.patchValue(event.name);
    this.categoryId = event.id;
    this.hideSubCategoryDropdown = true;
  }

  onCategoryClickout() {
    this.hideDropdown = true;
    this.hideSubCategoryDropdown = true;
  }

  onSubCategoryClickout() {
    this.hideSubCategoryDropdown = true;
  }

  showCategoryDropdown() {
    this.hideDropdown = false;
    this.form.get('Category')?.patchValue(this.form.get('Category')?.value);
  }

  showSubcategoryDropdown() {
    this.hideSubCategoryDropdown = false;
  }
}
