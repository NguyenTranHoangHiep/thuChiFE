import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlUserComponent } from './ql-user.component';

describe('QlUserComponent', () => {
  let component: QlUserComponent;
  let fixture: ComponentFixture<QlUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QlUserComponent]
    });
    fixture = TestBed.createComponent(QlUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
