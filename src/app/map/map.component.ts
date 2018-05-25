import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {} from '@types/googlemaps';

import { RestaurantsService } from '../restaurants/restaurants.service';
import { DataAccessService } from '../shared/data-access.service';

import { Restaurant } from '../restaurants/restaurant.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('panel') panelRef: ElementRef;

  map: google.maps.Map;
  mapLatLng: google.maps.LatLng = new google.maps.LatLng(47.673988, -122.121513);

  currentLocMarker: google.maps.Marker;
  restaurantMarkers: google.maps.Marker[] = [];

  private restaurantSubscription: Subscription;
  private directionsSubscription: Subscription;
  private directionsDisplay: google.maps.DirectionsRenderer = new google.maps.DirectionsRenderer();

  constructor(private daService: DataAccessService,
              private restaurantsService: RestaurantsService) { }

  ngOnInit() {
    this.restaurantSubscription = this.restaurantsService.restaurantsChanged
      .subscribe((restaurants: Restaurant[]) => {
        this.updateMap(restaurants);
      });

    this.directionsSubscription = this.daService.directionsChanged
      .subscribe((directions: google.maps.DirectionsResult) => {
        this.displayDirections(directions);
      });
  }

  ngAfterViewInit()
  {
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: this.mapLatLng,
      zoom: 11
    });

    this.currentLocMarker = new google.maps.Marker({
      position: this.mapLatLng,
      map: null,
      title: 'Your Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });

  }

  ngOnDestroy()
  {
    this.restaurantSubscription.unsubscribe();
    this.directionsSubscription.unsubscribe();
  }

  updateMap(restaurants: Restaurant[]) {
    this.clearMap();
    this.setLocation();
    this.updateDisplay(restaurants);
  }

  setLocation() {
    const location = this.daService.currentLocation;
    this.map.setCenter(location);
    this.map.setZoom(11);
    this.currentLocMarker.setMap(this.map);
    this.currentLocMarker.setPosition(location);
  }

  updateDisplay(restaurants: Restaurant[]) {

    for (let i in restaurants)
    {
      let loc = restaurants[i].location;
      const marker = new google.maps.Marker({
        position: loc,
        map: this.map,
        title: restaurants[i].name,
      });

      const infoWindowContent = `<p style="font-weight:bold;">${restaurants[i].name}</p><p>${restaurants[i].address}</p>`;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });   

      this.restaurantMarkers.push(marker);
    }
  }

  clearMap() {
    for(let marker of this.restaurantMarkers)
    {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    }

    this.restaurantMarkers = [];
    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setPanel(null);
  }

  displayDirections(directions: google.maps.DirectionsResult) {
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.panelRef.nativeElement);
    this.directionsDisplay.setDirections(directions);
  }
}
