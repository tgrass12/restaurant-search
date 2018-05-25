import { Component, OnInit, Input } from '@angular/core';

import { DataAccessService } from '../../shared/data-access.service';
import { Restaurant } from '../restaurant.model';
import { PricePipe } from '../../shared/price.pipe';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  @Input() restaurant: Restaurant;

  constructor(private daService: DataAccessService) { }

  ngOnInit() {
  }

  getDirections() {
    this.daService.getDirections(this.restaurant.location);
  }
}
