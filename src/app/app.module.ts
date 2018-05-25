import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';

import { DataAccessService } from './shared/data-access.service';
import { RestaurantsService } from './restaurants/restaurants.service';

import { PricePipe } from './shared/price.pipe';

import { AppComponent } from './app.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurants/restaurant/restaurant.component';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantsComponent,
    HeaderComponent,
    HomeComponent,
    RestaurantComponent,
    SearchComponent,
    PricePipe,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
  ],
  providers: [DataAccessService, RestaurantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
