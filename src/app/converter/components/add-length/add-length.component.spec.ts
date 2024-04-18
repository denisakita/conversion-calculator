import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLengthComponent } from './add-length.component';

describe('AddLengthComponent', () => {
  let component: AddLengthComponent;
  let fixture: ComponentFixture<AddLengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLengthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
