import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AddLengthComponent} from "../add-length/add-length.component";
import {LengthService} from "../../services";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-length-converter',
  templateUrl: './length-converter.component.html',
  styleUrls: ['./length-converter.component.css']
})
export class LengthConverterComponent implements OnInit {
  lengthForm: FormGroup = new FormGroup<any>({});
  result: string = '';
  lengthUnits: string[] = [];
  symbol: string = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public dialog: MatDialog,
              private lengthService: LengthService,
              private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.lengthForm = this.formBuilder.group({
      inputValue: [null, Validators.required],
      inputUnit: ['Meter (m)', Validators.required],
      outputUnit: ['Inch (in)', Validators.required]
    });

    // Initialize lengthUnits
    this.lengthUnits = this.lengthService.lengthUnits;
  }


  convert(): void {
    if (this.lengthForm.invalid) return;

    const inputValue = this.lengthForm.get('inputValue')!.value;
    const inputUnit = this.lengthForm.get('inputUnit')!.value;
    const outputUnit = this.lengthForm.get('outputUnit')!.value;

    try {

      this.result = this.lengthService.convert(inputValue, inputUnit, outputUnit);
      this.symbol = this.lengthService.getSymbol(outputUnit);

    } catch (error: any) {
      console.error(error);
      this.snackBar.open(`Conversion error: ${error.message}`, 'Dismiss', {
        duration: 3000
      });
    }
  }

  redirectToCurrencyConverter() {
    this.router.navigateByUrl('/currency-converter');
  }

  addNewLengthMeasure() {
    const dialogRef = this.dialog.open(AddLengthComponent, {
      width: '400px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(selectedUnit => {
      if (selectedUnit) {
        this.lengthForm.get('inputUnit')?.setValue(selectedUnit);
        this.lengthForm.get('outputUnit')?.setValue(selectedUnit);

        this.lengthService.addLengthUnit(selectedUnit);

        this.snackBar.open(`Newly added unit: ${selectedUnit}`, 'Dismiss', {
          duration: 3000
        });
      }
    });
  }
}
