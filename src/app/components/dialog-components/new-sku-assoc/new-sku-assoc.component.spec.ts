import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkuAssocComponent } from './new-sku-assoc.component';

describe('NewSkuAssocComponent', () => {
  let component: NewSkuAssocComponent;
  let fixture: ComponentFixture<NewSkuAssocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSkuAssocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSkuAssocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
