import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LengthService {

  lengthUnits: string[] = [];
  allLengthUnits: string[] = [];

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
  ];

  private readonly CONVERSION_FACTORS: { [key: string]: number } = {
    'Meter (m)->Meter (m)': 1,
    'Yard (yd)->Yard (yd)': 1,
    'Inch (in)->Inch (in)': 1,
    'Foot (ft)->Foot (ft)': 1,
    'Kilometer (km)->Kilometer (km)': 1,
    'Mile (mi)->Mile (mi)': 1,
    'Centimeter (cm)->Centimeter (cm)': 1,
    'Millimeter (mm)->Millimeter (mm)': 1,

    // Meter
    'Meter (m)->Yard (yd)': 1.09361,
    'Meter (m)->Inch (in)': 39.3701,
    'Meter (m)->Foot (ft)': 3.28084,
    'Meter (m)->Kilometer (km)': 0.001,
    'Meter (m)->Mile (mi)': 0.000621371,
    'Meter (m)->Centimeter (cm)': 100,
    'Meter (m)->Millimeter (mm)': 1000,

    // Yard
    'Yard (yd)->Meter (m)': 0.9144,
    'Yard (yd)->Inch (in)': 36,
    'Yard (yd)->Foot (ft)': 3,
    'Yard (yd)->Kilometer (km)': 0.0009144,
    'Yard (yd)->Mile (mi)': 0.000568182,
    'Yard (yd)->Centimeter (cm)': 91.44,
    'Yard (yd)->Millimeter (mm)': 914.4,

    // Inch
    'Inch (in)->Meter (m)': 0.0254,
    'Inch (in)->Yard (yd)': 0.0277778,
    'Inch (in)->Foot (ft)': 0.0833333,
    'Inch (in)->Kilometer (km)': 0.0000254,
    'Inch (in)->Mile (mi)': 0.000015783,
    'Inch (in)->Centimeter (cm)': 2.54,
    'Inch (in)->Millimeter (mm)': 25.4,

    // Foot
    'Foot (ft)->Meter (m)': 0.3048,
    'Foot (ft)->Yard (yd)': 0.333333,
    'Foot (ft)->Inch (in)': 12,
    'Foot (ft)->Kilometer (km)': 0.0003048,
    'Foot (ft)->Mile (mi)': 0.000189394,
    'Foot (ft)->Centimeter (cm)': 30.48,
    'Foot (ft)->Millimeter (mm)': 304.8,

    // Kilometer
    'Kilometer (km)->Meter (m)': 1000,
    'Kilometer (km)->Yard (yd)': 1093.61,
    'Kilometer (km)->Inch (in)': 39370.1,
    'Kilometer (km)->Foot (ft)': 3280.84,
    'Kilometer (km)->Mile (mi)': 0.621371,
    'Kilometer (km)->Centimeter (cm)': 100000,
    'Kilometer (km)->Millimeter (mm)': 1000000,

    // Mile
    'Mile (mi)->Meter (m)': 1609.34,
    'Mile (mi)->Yard (yd)': 1760,
    'Mile (mi)->Inch (in)': 63360,
    'Mile (mi)->Foot (ft)': 5280,
    'Mile (mi)->Kilometer (km)': 1.60934,
    'Mile (mi)->Centimeter (cm)': 160934,
    'Mile (mi)->Millimeter (mm)': 1609340,

    // Centimeter
    'Centimeter (cm)->Meter (m)': 0.01,
    'Centimeter (cm)->Yard (yd)': 0.0109361,
    'Centimeter (cm)->Inch (in)': 0.393701,
    'Centimeter (cm)->Foot (ft)': 0.0328084,
    'Centimeter (cm)->Kilometer (km)': 0.00001,
    'Centimeter (cm)->Mile (mi)': 0.0000062137,
    'Centimeter (cm)->Millimeter (mm)': 10,

    // Millimeter
    'Millimeter (mm)->Meter (m)': 0.001,
    'Millimeter (mm)->Yard (yd)': 0.00109361,
    'Millimeter (mm)->Inch (in)': 0.0393701,
    'Millimeter (mm)->Foot (ft)': 0.00328084,
    'Millimeter (mm)->Kilometer (km)': 0.000001,
    'Millimeter (mm)->Mile (mi)': 0.000000621371,
    'Millimeter (mm)->Centimeter (cm)': 0.1,
  };

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

  convert(inputValue: number, inputUnit: string, outputUnit: string): number {
    if (inputUnit === outputUnit) {
      return inputValue;
    }

    const conversionFactorKey = `${inputUnit}->${outputUnit}`;
    const conversionFactor = this.CONVERSION_FACTORS[conversionFactorKey];

    if (conversionFactor !== undefined) {
      return inputValue * conversionFactor;
    } else {
      throw new Error(`Conversion from ${inputUnit} to ${outputUnit} is not supported.`);
    }
  }

}
