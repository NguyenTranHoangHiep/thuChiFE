import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrangChuUsersComponent } from './trang-chu-users.component';

describe('TrangChuUsersComponent', () => {
  let component: TrangChuUsersComponent;
  let fixture: ComponentFixture<TrangChuUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrangChuUsersComponent]
    });
    fixture = TestBed.createComponent(TrangChuUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
