import { Component, OnInit, Optional, Self } from '@angular/core';

import { ControlValueAccessor, NgControl } from '@angular/forms';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CityTypeaheadItem } from './../../models/city-typeahead-item.model';
import { CitiesService } from './../../services/cities.service';

@Component({
  selector: 'jv-cities-typeahead',
  templateUrl: './cities-typeahead.component.html',
  styleUrls: ['./cities-typeahead.component.scss'],
})
export class CitiesTypeaheadComponent implements OnInit, ControlValueAccessor {
  dataSource$: Observable<CityTypeaheadItem[]>;
  search: string;
  loading: boolean;

  disabled: boolean;
  private onChance: (value: CityTypeaheadItem) => void;
  private onTouched: () => void;

  constructor(
    @Optional() @Self() public control: NgControl,
    private citiesService: CitiesService
  ) {
    control.valueAccessor = this;
  }

  ngOnInit(): void {
    this.dataSource$ = new Observable((subscriber: Subscriber<string>) =>
      subscriber.next(this.search)
    ).pipe(switchMap((query) => this.citiesService.getCities(query)));
  }

  onSelect(match: TypeaheadMatch) {
    this.onTouched();
    this.onChance(match.item);
  }

  registerOnChange(fn: (value: CityTypeaheadItem) => void) {
    this.onChance = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue() {}
}
