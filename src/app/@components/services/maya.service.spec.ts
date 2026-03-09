import { TestBed } from '@angular/core/testing';

import { MayaService } from './maya.service';

describe('MayaService', () => {
  let service: MayaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MayaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
