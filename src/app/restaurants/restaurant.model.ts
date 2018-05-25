export class Restaurant {
  constructor(
    public name: string, 
    public location: google.maps.LatLng,
    public address: string,
    public price: string,
    public rating: string,
    public rawLatLng?: {lat: number, lng: number}
  ) {}
}