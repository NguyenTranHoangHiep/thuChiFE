import { TestBed } from '@angular/core/testing';

import { NganSachService } from './ngan-sach.service';

describe('NganSachService', () => {
  let service: NganSachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NganSachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
