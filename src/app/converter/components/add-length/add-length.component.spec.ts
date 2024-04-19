import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AddLengthComponent} from './add-length.component';
import {LengthService} from '../../services';
import {SharedModule} from '../../../shared/shared.module';
import {By} from "@angular/platform-browser";

describe('AddLengthComponent', () => {
  let component: AddLengthComponent;
  let fixture: ComponentFixture<AddLengthComponent>;
  let mockDialogRef: MatDialogRef<AddLengthComponent>;
  let lengthServiceSpy: jasmine.SpyObj<LengthService>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const lengthService = jasmine.createSpyObj('LengthService', ['getAllLengthUnits']);

    await TestBed.configureTestingModule({
      declarations: [AddLengthComponent],
      imports: [ReactiveFormsModule, SharedModule, BrowserAnimationsModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: LengthService, useValue: lengthService}
      ]
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddLengthComponent>>;
    lengthServiceSpy = TestBed.inject(LengthService) as jasmine.SpyObj<LengthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with selectedUnit field', () => {
    expect(component.lengthForm.get('selectedUnit')).toBeTruthy();
  });

  it('should not close dialog when add button clicked and form is invalid', () => {
    component.onAddClick();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    it('should initialize lengthUnits with data from lengthService', () => {

      const mockLengthUnits = ['meter', 'kilometer'];
      lengthServiceSpy.getAllLengthUnits.and.returnValue(mockLengthUnits);

      component.ngOnInit();

      expect(component.lengthUnits).toEqual(mockLengthUnits);
      expect(lengthServiceSpy.getAllLengthUnits).toHaveBeenCalled();
    });
  });

  it('should display dialog title', () => {
    const titleElement = fixture.debugElement.query(By.css('.dialog-title')).nativeElement;
    expect(titleElement.textContent).toContain('Add New Length Measure');
  });

  it('should display form field for selecting length units', () => {
    const selectElement = fixture.debugElement.query(By.css('.unit-select mat-select'));
    expect(selectElement).toBeTruthy();
  });

  it('should close dialog when "Cancel" button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('.button-row button[mat-button]'));
    cancelButton.triggerEventHandler('click', null);
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should call onAddClick method when "Add" button is clicked', () => {
    spyOn(component, 'onAddClick');
    const addButton = fixture.debugElement.query(By.css('.button-row button[mat-raised-button]'));
    addButton.triggerEventHandler('click', null);
    expect(component.onAddClick).toHaveBeenCalled();
  });
});

