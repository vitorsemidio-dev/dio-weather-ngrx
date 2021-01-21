import { createAction, props } from '@ngrx/store';
import { Bookmark } from 'src/app/shared/models/bookmark.model';

export const loadCurrentWeather = createAction(
  '[Home] Load Current Weather',
  props<{ query: string }>()
);

export const loadCurrentWeatherSuccess = createAction(
  '[Weather API] Load Current Weather Success',
  props<{ entity: any }>()
);

export const loadCurrentWeatherFailed = createAction(
  '[Weather API] Load Current Weather Failure'
);

export const toggleBookmark = createAction(
  '[Home] Toggle Bookmar',
  props<{ entity: Bookmark }>()
);

export const clearHomeState = createAction('[Home] Clear Home State');

export const loadCurrentWeatherById = createAction(
  '[Home] Load Current Weather By Id',
  props<{ id: string }>()
);
