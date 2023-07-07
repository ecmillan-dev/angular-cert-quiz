import { Category } from './../data.models';
import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-autocomplete-option',
  templateUrl: './autocomplete-option.component.html',
  styleUrls: ['./autocomplete-option.component.css']
})
export class AutocompleteOptionComponent implements OnChanges {
  @Input() searchString?: string;
  @Input() category!: Category;

  matches: AutocompleteMatch[] = [];



  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['searchString'];
    if (change && this.searchString) {

      this.matches = [];
      let matchIndex = this.category.name.toLocaleLowerCase().indexOf(this.searchString.toLocaleLowerCase());
      console.log(matchIndex, this.searchString, this.category.name);
      if (matchIndex !== -1) {
        let newName = this.category.name;
        if (matchIndex === 0) {
          this.matches.push({stringValue: this.category.name.substring(0, this.searchString.length), isMatch: true});
          newName = newName.substring(this.searchString.length);
        }


        while (newName.length > 0) {
          const nextMatchIndex = newName.toLocaleLowerCase().indexOf(this.searchString.toLocaleLowerCase());
          if (nextMatchIndex === -1) {
            this.matches.push({stringValue: newName, isMatch: false});
            newName = '';
          } else {
            this.matches.push({stringValue: newName.substring(0, nextMatchIndex), isMatch: false});
            this.matches.push({stringValue: newName.substring(nextMatchIndex, nextMatchIndex + this.searchString.length), isMatch: true});
            newName = newName.substring(nextMatchIndex + this.searchString.length);
          }
        }
      } else {
        this.matches.push({stringValue: this.category.name, isMatch: false});
      }
    }
  }

}

interface AutocompleteMatch {
  stringValue: string;
  isMatch: boolean;
}
