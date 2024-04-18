import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LengthService {
  private readonly LENGTH_UNITS_KEY = 'length_units';
  private readonly INITIAL_LENGTH_UNITS = ['Meter (m)', 'Yard (yd)', 'Inch (in)'];
  private readonly ALL_LENGTH_UNITS = [
    'Meter (m)',
    'Yard (yd)',
    'Inch (in)',
    'Foot (ft)',
    'Kilometer (km)',
    'Mile (mi)',
    'Centimeter (cm)',
    'Millimeter (mm)',
    'Nautical Mile (nmi)',
    'League (lea)'
  ];

  lengthUnits: string[] = [];

  allLengthUnits: string[] = [];

  constructor() {
    const storedLengthUnits = localStorage.getItem(this.LENGTH_UNITS_KEY);
    this.lengthUnits = storedLengthUnits ? JSON.parse(storedLengthUnits) : this.INITIAL_LENGTH_UNITS;

    // Initialize allLengthUnits excluding already chosen length units
    this.updateAllLengthUnits();
  }

  addLengthUnit(unit: string) {
    if (!this.lengthUnits.includes(unit)) {
      this.lengthUnits.push(unit);
      localStorage.setItem(this.LENGTH_UNITS_KEY, JSON.stringify(this.lengthUnits));
      this.updateAllLengthUnits();
    }
  }

  removeLengthUnit(unit: string) {
    const index = this.lengthUnits.indexOf(unit);
    if (index !== -1) {
      this.lengthUnits.splice(index, 1);
      localStorage.setItem(this.LENGTH_UNITS_KEY, JSON.stringify(this.lengthUnits));
      this.updateAllLengthUnits();
    }
  }

  private updateAllLengthUnits() {
    this.allLengthUnits = this.ALL_LENGTH_UNITS.filter(unit => !this.lengthUnits.includes(unit));
  }

  getAllLengthUnits(): string[] {
    return this.allLengthUnits;
  }
}
