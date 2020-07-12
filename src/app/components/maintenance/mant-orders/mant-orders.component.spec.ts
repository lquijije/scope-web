import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantOrdersComponent } from './mant-orders.component';

describe('MantOrdersComponent', () => {
  let component: MantOrdersComponent;
  let fixture: ComponentFixture<MantOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
