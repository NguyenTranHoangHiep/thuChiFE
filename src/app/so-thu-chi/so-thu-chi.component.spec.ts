import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoThuChiComponent } from './so-thu-chi.component';

describe('SoThuChiComponent', () => {
  let component: SoThuChiComponent;
  let fixture: ComponentFixture<SoThuChiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoThuChiComponent]
    });
    fixture = TestBed.createComponent(SoThuChiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
