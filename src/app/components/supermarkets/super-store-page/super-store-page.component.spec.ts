import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperStorePageComponent } from './super-store-page.component';

describe('SuperStorePageComponent', () => {
  let component: SuperStorePageComponent;
  let fixture: ComponentFixture<SuperStorePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperStorePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
