import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-autocomplete-option-name-part',
  templateUrl: './autocomplete-option-name-part.component.html',
  styleUrls: ['./autocomplete-option-name-part.component.css']
})
export class AutocompleteOptionNamePartComponent {
  @Input() stringValue?: string;
  @Input() isMatch: boolean = false;
}
