import { TestBed } from '@angular/core/testing';

import { LengthService } from './length.service';

describe('LengthService', () => {
  let service: LengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
