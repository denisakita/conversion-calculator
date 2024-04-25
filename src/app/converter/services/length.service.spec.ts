import {LengthService} from './length.service';
import {TestBed} from "@angular/core/testing";

describe('LengthService', () => {
  let service: LengthService;
  const mockLocalStorage = jasmine.createSpyObj('localStorage', ['getItem']);

  beforeEach(() => {
    mockLocalStorage.getItem.and.returnValue(null);
    spyOn(Storage.prototype, 'getItem').and.returnValue(mockLocalStorage.getItem());

    TestBed.configureTestingModule({
      providers: [LengthService]
    });
    service = TestBed.inject(LengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize lengthUnits from default values', () => {
    expect(service.lengthUnits.length).toEqual(3);
  });

  it('should initialize lengthUnits from localStorage if available', () => {
    mockLocalStorage.getItem.and.returnValue(JSON.stringify(['Meter (m)', 'Kilometer (km)']));
    service = new LengthService();
    expect(service.lengthUnits.length).toEqual(3);
  });

  it('should add a new unit and persist in localStorage', () => {
    const spySetItem = spyOn(Storage.prototype, 'setItem');
    const newUnit = 'Foot (ft)';

    service.addLengthUnit(newUnit);

    expect(service.lengthUnits).toContain(newUnit);

    expect(spySetItem).toHaveBeenCalledWith(
      service.LENGTH_UNITS_KEY,
      JSON.stringify([...service.lengthUnits])
    );
  });

  it('should remove a unit and persist in localStorage', () => {
    service.addLengthUnit('Foot (ft)');
    const spySetItem = spyOn(Storage.prototype, 'setItem');
    service.removeLengthUnit('Foot (ft)');
    expect(service.lengthUnits);

  });

  it('should return all length units', () => {
    const allLengthUnits = service.getAllLengthUnits();

    expect(allLengthUnits).toEqual([
      'Foot (ft)',
      'Kilometer (km)',
      'Mile (mi)',
      'Centimeter (cm)',
      'Millimeter (mm)',]);
  });

  it('should convert input value from one unit to another', () => {

    let result = service.convert(10, 'Meter (m)', 'Meter (m)');
    expect(result).toEqual('10 m');

    result = service.convert(1, 'Meter (m)', 'Inch (in)');
    expect(result).toEqual('39.37 in');

    result = service.convert(12, 'Inch (in)', 'Meter (m)');
    expect(result).toEqual('0.30 m');

  });

  it('should return symbol for the given unit', () => {
    let symbol = service.getSymbol('Meter (m)');
    expect(symbol).toEqual('m');

    symbol = service.getSymbol('Inch (in)');
    expect(symbol).toEqual('in');

  });

});
