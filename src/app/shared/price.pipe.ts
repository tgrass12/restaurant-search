import { Pipe, PipeTransform } from '@angular/core';

//Takes the price level and converts it to that number of $'s
//Example: '4' => '$$$$'
@Pipe({name: 'price'})
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    return '$'.repeat(value);
  }
}