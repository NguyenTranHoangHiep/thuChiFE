import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NganSachComponent } from './ngan-sach.component';

describe('NganSachComponent', () => {
  let component: NganSachComponent;
  let fixture: ComponentFixture<NganSachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NganSachComponent]
    });
    fixture = TestBed.createComponent(NganSachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
