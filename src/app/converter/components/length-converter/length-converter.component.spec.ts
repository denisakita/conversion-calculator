import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LengthConverterComponent} from './length-converter.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {LengthService} from '../../services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SharedModule} from "../../../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;
  let lengthService: LengthService;
  let snackBar: MatSnackBar;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LengthConverterComponent],
      imports: [SharedModule, ReactiveFormsModule, MatFormFieldModule],
      providers: [
        FormBuilder,
        {
          provide: LengthService,
          useValue: jasmine.createSpyObj('LengthService', ['convert', 'getSymbol', 'lengthUnits', 'addLengthUnit'])
        },
        {provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open'])},
        {provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open'])}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    lengthService = TestBed.inject(LengthService);
    snackBar = TestBed.inject(MatSnackBar);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty input value', () => {
    component.lengthForm.get('inputValue')?.setValue('');

    component.convert();

    expect(snackBar.open).toHaveBeenCalledWith('Please fill all the fields with valid values', 'Dismiss', {duration: 3000});
  });

  it('should handle missing input unit', () => {
    component.lengthForm.get('inputValue')?.setValue(100);
    component.lengthForm.get('outputUnit')?.setValue('Foot (ft)');

    component.convert();

    expect(snackBar.open).toHaveBeenCalledWith('Please fill all the fields with valid values', 'Dismiss', {duration: 3000});
  });

  it('should handle missing output unit', () => {
    component.lengthForm.get('inputValue')?.setValue(100);
    component.lengthForm.get('inputUnit')?.setValue('Meter (m)');

    component.convert();

    expect(snackBar.open).toHaveBeenCalledWith('Please fill all the fields with valid values', 'Dismiss', {duration: 3000});
  });


  it('should not allow negative input value for units that don\'t support it (e.g., meters)', () => {
    component.lengthForm.get('inputValue')?.setValue(-100);
    component.lengthForm.get('inputUnit')?.setValue('Meter (m)');
    component.lengthForm.get('outputUnit')?.setValue('Foot (ft)');

    expect(component.lengthForm.get('inputValue')?.invalid).toBeTruthy();
  });

});
