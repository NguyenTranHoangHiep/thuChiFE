import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongkeComponent } from './thongke.component';

describe('ThongkeComponent', () => {
  let component: ThongkeComponent;
  let fixture: ComponentFixture<ThongkeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThongkeComponent]
    });
    fixture = TestBed.createComponent(ThongkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
