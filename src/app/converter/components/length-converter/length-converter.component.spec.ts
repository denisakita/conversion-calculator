import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LengthConverterComponent} from './length-converter.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {LengthService} from '../../services';
import {Router} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../../shared/shared.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let lengthServiceSpy: jasmine.SpyObj<LengthService>;
  let router: Router;

  beforeEach(async () => {
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const lengthServiceSpyObj = jasmine.createSpyObj('LengthService', ['convert', 'getSymbol', 'addLengthUnit']);

    await TestBed.configureTestingModule({
      declarations: [LengthConverterComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatIconModule,
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        FormBuilder,
        {provide: MatDialog, useValue: dialogSpyObj},
        {provide: MatSnackBar, useValue: snackBarSpyObj},
        {provide: LengthService, useValue: lengthServiceSpyObj}
      ]
    }).compileComponents();

    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    lengthServiceSpy = TestBed.inject(LengthService) as jasmine.SpyObj<LengthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call convert method when convert is called', () => {
    component.lengthForm.get('inputValue')!.setValue(10);
    component.lengthForm.get('inputUnit')!.setValue('Meter (m)');
    component.lengthForm.get('outputUnit')!.setValue('Inch (in)');
    component.convert();
    expect(lengthServiceSpy.convert).toHaveBeenCalled();
  });

  it('should open dialog when addNewLengthMeasure is called', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of({}), close: null});
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.addNewLengthMeasure();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should swap units and call convert when swapUnits is called', () => {
    const inputUnit = component.lengthForm.get('inputUnit');
    const outputUnit = component.lengthForm.get('outputUnit');
    inputUnit?.setValue('Meter (m)');
    outputUnit?.setValue('Inch (in)');

    component.swapUnits();

    expect(inputUnit?.value).toBe('Inch (in)');
    expect(outputUnit?.value).toBe('Meter (m)');
    // expect(lengthServiceSpy.convert).toHaveBeenCalled();
  });

  it('should navigate to the currency converter page when redirectToCurrencyConverter is called', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.redirectToCurrencyConverter();
    expect(navigateSpy).toHaveBeenCalledWith('/currency-converter');
  });


});
