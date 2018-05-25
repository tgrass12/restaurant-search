export class SearchOptions {

  public constructor(
    public searchTerm: string,
    public minPrice: number,
    public maxPrice: number,
    public minRating: number,
    public maxRating: number,
    public sortBy: string,
    public radius?: number
  ) {}
}