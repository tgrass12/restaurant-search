import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataAccessService } from '../shared/data-access.service';
import { SearchOptions } from '../shared/search-options.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private daService: DataAccessService, private http: HttpClient) { }

  ngOnInit() {
  }

  //Default Search Parameters
  radius: number = 10;
  address: string = '';
  keyword: string = '';
  sortBy: string = 'relevance';
  minPrice: number = 0;
  maxPrice: number = 4;
  minRating: number = 1;
  maxRating: number = 5;

  onSearch(form: NgForm) {
    const formValues = form.value;
    const address = formValues.address;
    const searchOptions = new SearchOptions(
    formValues.keyword,
    formValues.minPrice,
    formValues.maxPrice,
    formValues.minRating,
    formValues.maxRating,
    formValues.sortBy,
    formValues.radius * 1609.344,  //API requires meters, slider is in miles
    );

    this.daService.getRestaurants(address, searchOptions);    
  }
}
