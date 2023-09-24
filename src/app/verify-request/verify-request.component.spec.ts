import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRequestComponent } from './verify-request.component';

describe('VerifyRequestComponent', () => {
  let component: VerifyRequestComponent;
  let fixture: ComponentFixture<VerifyRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyRequestComponent]
    });
    fixture = TestBed.createComponent(VerifyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
