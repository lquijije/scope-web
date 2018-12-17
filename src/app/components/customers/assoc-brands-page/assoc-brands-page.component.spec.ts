import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssocBrandsPageComponent } from './assoc-brands-page.component';

describe('AssocBrandsPageComponent', () => {
  let component: AssocBrandsPageComponent;
  let fixture: ComponentFixture<AssocBrandsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssocBrandsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssocBrandsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
