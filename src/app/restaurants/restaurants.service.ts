import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  constructor() {}

  restaurants: Restaurant[];
  restaurantsChanged: Subject<Restaurant[]> = new Subject<Restaurant[]>();

  public updateRestaurants(restaurants: Restaurant[])
  {  
    this.restaurants = restaurants;
    this.restaurantsChanged.next(this.restaurants.slice());
  }
}