import { Category } from './../data.models';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnChanges {
  @Input() categories!: Category[];
  @Input() searchString?: string;
  @Input() hideDropdown: boolean = true;

  @Output() choice: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() clickOut: EventEmitter<void> = new EventEmitter<void>();

  matchingCategories: Category[] = [];


  @HostListener('document:click')
  clickout() {
    this.clickOut.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const searchChange = changes['searchString'];
    const categoryChange = changes['categories'];
    console.log(changes);
    if (searchChange) {
      this.searchString = searchChange.currentValue;
      this.filterCategories(this.searchString ?? '', this.categories);
    }
    if (categoryChange) {
      this.categories = categoryChange.currentValue;
      console.log('filterCategories', categoryChange.currentValue, this.categories);
      this.filterCategories(this.searchString ?? '', this.categories);
    }


  }

  private filterCategories(searchString: string, categories: Category[]) {
    if (categories && searchString) {
      this.matchingCategories = categories.filter(c => c.name.toLocaleLowerCase().includes(searchString?.toLocaleLowerCase() ?? ''));
      console.log(this.matchingCategories, categories, searchString);
    } else {
      this.matchingCategories = categories;
    }
  }

  onChoice(event: any) {
    this.choice.emit(event);
  }

  onClickRow(event: any) {
    console.log(event);
  }
}
