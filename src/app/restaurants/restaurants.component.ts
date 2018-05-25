import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.model';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit, OnDestroy {

  restaurants: Restaurant[];
  private subscription: Subscription;

  constructor(private restaurantsService: RestaurantsService) { }

  ngOnInit() {
    this.subscription = this.restaurantsService.restaurantsChanged.subscribe(
      (restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
