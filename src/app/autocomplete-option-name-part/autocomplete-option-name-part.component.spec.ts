import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteOptionNamePartComponent } from './autocomplete-option-name-part.component';

describe('AutocompleteOptionNamePartComponent', () => {
  let component: AutocompleteOptionNamePartComponent;
  let fixture: ComponentFixture<AutocompleteOptionNamePartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteOptionNamePartComponent]
    });
    fixture = TestBed.createComponent(AutocompleteOptionNamePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
