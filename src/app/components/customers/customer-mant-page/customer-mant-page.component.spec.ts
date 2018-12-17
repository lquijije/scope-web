import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMantPageComponent } from './customer-mant-page.component';

describe('CustomerMantPageComponent', () => {
  let component: CustomerMantPageComponent;
  let fixture: ComponentFixture<CustomerMantPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMantPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
