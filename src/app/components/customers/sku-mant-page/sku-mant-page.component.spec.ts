import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuMantPageComponent } from './sku-mant-page.component';

describe('SkuMantPageComponent', () => {
  let component: SkuMantPageComponent;
  let fixture: ComponentFixture<SkuMantPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuMantPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuMantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
