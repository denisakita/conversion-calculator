import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LengthService {
  lengthUnits: string[] = ['Meter (m)', 'Yard (yd)', 'Inch (in)'];
  allLengthUnits: string[] = [];

  constructor() {
    this.allLengthUnits = [
      ...this.lengthUnits,
      'Foot (ft)',
      'Kilometer (km)',
      'Mile (mi)',
      'Centimeter (cm)',
      'Millimeter (mm)',
      'Nautical Mile (nmi)',
      'League (lea)',
    ];
  }

  addLengthUnit(unit: string) {
    this.lengthUnits.push(unit);
  }

  getAllLengthUnits(): string[] {
    return this.allLengthUnits;
  }

}
