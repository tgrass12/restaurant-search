import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { RestaurantsService } from '../restaurants/restaurants.service';
import { Restaurant } from '../restaurants/restaurant.model';
import { SearchOptions } from './search-options.model';

@Injectable()
export class DataAccessService {

  constructor(private http: HttpClient,
              private restaurantsService: RestaurantsService) {}

  public currentLocation: google.maps.LatLng;
  public directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
  public directionsChanged: Subject<google.maps.DirectionsResult> = new Subject<google.maps.DirectionsResult>();

  setCurrentLocation(address: string) {
    
    const params = new HttpParams().set("address", address);
    return this.http.get('/api/currentlocation', { params: params })
  }

  getRestaurants(location: string, options: SearchOptions) {

    this.setCurrentLocation(location)
      .pipe(mergeMap((latLng: {lat: number, lng: number}) => {

        this.currentLocation = new google.maps.LatLng(latLng.lat, latLng.lng);

        const params = this.initHttpParams(options);

        return this.http.get('/api/restaurants', { params: params });
    })).subscribe(
      (restaurants: Restaurant[]) => {
        for (let r of restaurants)
        {
          r.location = new google.maps.LatLng(r.rawLatLng.lat, r.rawLatLng.lng);
        }

        this.restaurantsService.updateRestaurants(restaurants);
      }
    );
  }

  getDirections(toAddress: google.maps.LatLng) {
    const directionsRequest = {
      origin: this.currentLocation,
      destination: toAddress,
      travelMode: google.maps.TravelMode['DRIVING']
    };

    this.directionsService.route(directionsRequest, (response, status) => {
      if (status === google.maps.DirectionsStatus["OK"])
      {        
        this.directionsChanged.next(response);
      }
    });
  }

  initHttpParams(params: SearchOptions) {
    return new HttpParams()
      .set("latLng", `${this.currentLocation.lat()},${this.currentLocation.lng()}`)
      .set("keyword", params.searchTerm)
      .set("minPrice", String(params.minPrice))
      .set("maxPrice", String(params.maxPrice))
      .set("minRating", String(params.minRating))
      .set("maxRating", String(params.maxRating))
      .set("sortBy", params.sortBy)
      .set("radius", String(params.radius));
  }
}