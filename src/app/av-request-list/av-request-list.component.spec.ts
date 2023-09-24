import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvRequestListComponent } from './av-request-list.component';

describe('AvRequestListComponent', () => {
  let component: AvRequestListComponent;
  let fixture: ComponentFixture<AvRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvRequestListComponent]
    });
    fixture = TestBed.createComponent(AvRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
