import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRequestComponent } from './send-request.component';

describe('SendRequestComponent', () => {
  let component: SendRequestComponent;
  let fixture: ComponentFixture<SendRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendRequestComponent]
    });
    fixture = TestBed.createComponent(SendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
