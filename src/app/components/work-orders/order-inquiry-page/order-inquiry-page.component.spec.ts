import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInquiryPageComponent } from './order-inquiry-page.component';

describe('OrderInquiryPageComponent', () => {
  let component: OrderInquiryPageComponent;
  let fixture: ComponentFixture<OrderInquiryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderInquiryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderInquiryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
