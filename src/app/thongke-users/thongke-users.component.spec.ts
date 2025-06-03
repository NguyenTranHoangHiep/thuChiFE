import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongkeUsersComponent } from './thongke-users.component';

describe('ThongkeUsersComponent', () => {
  let component: ThongkeUsersComponent;
  let fixture: ComponentFixture<ThongkeUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThongkeUsersComponent]
    });
    fixture = TestBed.createComponent(ThongkeUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
