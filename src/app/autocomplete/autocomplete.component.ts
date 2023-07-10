import { Category } from './../data.models';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent implements OnChanges, OnInit {
  ngOnInit(): void {
    this.filterItems(this.searchString ?? '', this.items);
  }
  @Input() items!: any[];
  @Input() searchString?: string;
  @Input() hideDropdown: boolean = true;
  @Input() idColumn!: string;
  @Input() nameColumn!: string;
  @Input() inputFieldId!: string;

  @Output() choice: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickOut: EventEmitter<void> = new EventEmitter<void>();

  matchingItems: any[] = [];

  @HostListener('document:click', ['$event.target'])
  clickout(event: any) {
    // inputFieldId
    if (event?.id !== this.inputFieldId) {
      this.clickOut.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const searchChange = changes['searchString'];
    const itemChange = changes['items'];
    if (searchChange) {
      this.searchString = searchChange.currentValue;
      this.filterItems(this.searchString ?? '', this.items);
    }
    if (itemChange) {
      this.items = itemChange.currentValue;
      this.filterItems(this.searchString ?? '', this.items);
    }
  }

  private filterItems(searchString: string, items: any[]) {
    if (items && searchString) {
      this.matchingItems = items.filter((c) =>
        c[this.nameColumn]
          .toLocaleLowerCase()
          .includes(searchString?.toLocaleLowerCase() ?? '')
      );
    } else {
      this.matchingItems = items;
    }
  }

  onChoice(event: any) {
    this.choice.emit(event);
  }

  onClickRow(event: any, item: any) {
    this.choice.emit(item);
  }
}
