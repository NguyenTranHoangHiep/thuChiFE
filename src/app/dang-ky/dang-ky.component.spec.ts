import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DangKyComponent } from './dang-ky.component';

describe('DangKyComponent', () => {
  let component: DangKyComponent;
  let fixture: ComponentFixture<DangKyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DangKyComponent]
    });
    fixture = TestBed.createComponent(DangKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
