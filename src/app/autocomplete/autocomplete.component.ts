import { Category } from './../data.models';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnChanges {
  @Input() items!: any[];
  @Input() searchString?: string;
  @Input() hideDropdown: boolean = true;
  @Input() idColumn!: string;
  @Input() nameColumn!: string;

  @Output() choice: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickOut: EventEmitter<void> = new EventEmitter<void>();

  matchingItems: Category[] = [];


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
      this.filterCategories(this.searchString ?? '', this.items);
    }
    if (categoryChange) {
      this.items = categoryChange.currentValue;
      console.log('filterCategories', categoryChange.currentValue, this.items);
      this.filterCategories(this.searchString ?? '', this.items);
    }


  }

  private filterCategories(searchString: string, items: any[]) {
    if (items && searchString) {
      this.matchingItems = items.filter(c => c[this.nameColumn].toLocaleLowerCase().includes(searchString?.toLocaleLowerCase() ?? ''));
    } else {
      this.matchingItems = items;
    }
  }

  onChoice(event: any) {
    this.choice.emit(event);
  }

  onClickRow(event: any) {
    console.log(event);
  }
}
