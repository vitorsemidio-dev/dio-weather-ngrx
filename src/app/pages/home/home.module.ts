import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HomePage } from './containers/home/home.page';
import { HomeEffects } from './state/home.effects';
import { homeReducer } from './state/home.reducer';

import { ComponentsModule } from '../../shared/components/components.module';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { UnitSelectorComponent } from './containers/unit-selector/unit-selector.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    StoreModule.forFeature('home', homeReducer),
    EffectsModule.forFeature([HomeEffects]),
    ComponentsModule,
  ],
  declarations: [HomePage, CurrentWeatherComponent, UnitSelectorComponent],
})
export class HomeModule {}
