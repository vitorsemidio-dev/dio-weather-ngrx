import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import {
  PortalOutlet,
  DomPortalOutlet,
  ComponentPortal,
} from '@angular/cdk/portal';

import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors';
import { HomeState } from '../../state/home.reducer';
import { UnitSelectorComponent } from './../unit-selector/unit-selector.component';

import { CityTypeaheadItem } from './../../../../shared/models/city-typeahead-item.model';
import { CityWeather } from '../../../../shared/models/weather.model';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { Units } from 'src/app/shared/models/units.enum';

@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  searchControl: FormControl;
  searchControlWithAutocomplete: FormControl;

  cityWeather$: Observable<CityWeather>;
  bookmarksList$: Observable<Bookmark[]>;
  cityWeather: CityWeather;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;
  isCurrentFavorite$: Observable<boolean>;
  unit$: Observable<Units>;

  private componentDestroyed$ = new Subject();

  private portalOutlet: PortalOutlet;

  constructor(
    private store: Store<HomeState>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngOnInit() {
    this.searchControl = new FormControl('', Validators.required);
    this.searchControlWithAutocomplete = new FormControl(undefined);

    this.searchControlWithAutocomplete.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value: CityTypeaheadItem) => {
        if (!!value) {
          this.store.dispatch(
            fromHomeActions.loadCurrentWeatherById({
              id: value.geonameid.toString(),
            })
          );
        }
      });

    this.cityWeather$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeather)
    );
    this.cityWeather$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => (this.cityWeather = value));
    this.loading$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeatherLoading)
    );
    this.error$ = this.store.pipe(
      select(fromHomeSelectors.selectCurrentWeatherError)
    );

    this.bookmarksList$ = this.store.pipe(
      select(fromBookmarksSelectors.selectBookmarksList)
    );

    this.isCurrentFavorite$ = combineLatest([
      this.cityWeather$,
      this.bookmarksList$,
    ]).pipe(
      map(([current, bookmarksList]) => {
        if (!!current) {
          return bookmarksList.some(
            (bookmark) => bookmark.id === current.city.id
          );
        }
        return false;
      })
    );

    this.unit$ = this.store.pipe(select(fromConfigSelectors.selectUnitConfig));

    this.setupPortal();
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeActions.clearHomeState());
    this.portalOutlet.detach();
  }

  doSearch() {
    const query = this.searchControl.value;
    this.store.dispatch(fromHomeActions.loadCurrentWeather({ query }));
  }

  onToggleBookmark() {
    const { id, name, country, coord } = this.cityWeather.city;
    const bookmark = Object.assign(new Bookmark(), {
      id,
      name,
      country,
      coord,
    });

    this.store.dispatch(
      fromHomeActions.toggleBookmark({
        entity: bookmark,
      })
    );
  }

  private setupPortal() {
    const el = document.querySelector('#navbar-portal-outlet');
    this.portalOutlet = new DomPortalOutlet(
      el,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    this.portalOutlet.attach(new ComponentPortal(UnitSelectorComponent));
  }
}
