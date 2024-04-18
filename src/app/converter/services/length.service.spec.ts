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
});
