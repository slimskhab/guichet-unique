import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LraRequestListComponent } from './lra-request-list.component';

describe('LraRequestListComponent', () => {
  let component: LraRequestListComponent;
  let fixture: ComponentFixture<LraRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LraRequestListComponent]
    });
    fixture = TestBed.createComponent(LraRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
