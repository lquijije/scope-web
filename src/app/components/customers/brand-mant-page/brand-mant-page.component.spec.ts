import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMantPageComponent } from './brand-mant-page.component';

describe('BrandMantPageComponent', () => {
  let component: BrandMantPageComponent;
  let fixture: ComponentFixture<BrandMantPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandMantPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandMantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
