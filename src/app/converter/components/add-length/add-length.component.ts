import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {LengthService} from "../../services";

@Component({
  selector: 'app-add-length',
  templateUrl: './add-length.component.html',
  styleUrl: './add-length.component.css'
})
export class AddLengthComponent implements OnInit {
  lengthForm: FormGroup = new FormGroup<any>({});
  lengthUnits: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddLengthComponent>,
    private formBuilder: FormBuilder,
    private lengthService: LengthService,
  ) {
  }

  ngOnInit() {
    this.lengthForm = this.formBuilder.group({
      selectedUnit: ['', Validators.required]
    });

    this.lengthUnits = this.lengthService.getAllLengthUnits();

  }

  onAddClick(): void {
    if (this.lengthForm.valid) {
      const selectedUnit = this.lengthForm.value.selectedUnit;
      this.dialogRef.close(selectedUnit);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
