import { TestBed } from '@angular/core/testing';

import { GiaoDichService } from './giao-dich.service';

describe('GiaoDichService', () => {
  let service: GiaoDichService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiaoDichService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
