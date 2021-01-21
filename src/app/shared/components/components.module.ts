import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { LoaderComponent } from './loader/loader.component';
import { DetailedWeatherComponent } from './detailed-weather/detailed-weather.component';
import { DailyWeatherComponent } from './daily-weather/daily-weather.component';
import { CitiesTypeaheadComponent } from './cities-typeahead/cities-typeahead.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, TypeaheadModule.forRoot()],
  declarations: [
    LoaderComponent,
    DetailedWeatherComponent,
    DailyWeatherComponent,
    CitiesTypeaheadComponent,
  ],
  exports: [
    LoaderComponent,
    DetailedWeatherComponent,
    DailyWeatherComponent,
    CitiesTypeaheadComponent,
  ],
})
export class ComponentsModule {}
