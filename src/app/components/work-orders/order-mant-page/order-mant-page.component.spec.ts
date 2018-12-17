import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMantPageComponent } from './order-mant-page.component';

describe('OrderMantPageComponent', () => {
  let component: OrderMantPageComponent;
  let fixture: ComponentFixture<OrderMantPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMantPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
