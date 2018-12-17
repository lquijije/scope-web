import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperChainPageComponent } from './super-chain-page.component';

describe('SuperChainPageComponent', () => {
  let component: SuperChainPageComponent;
  let fixture: ComponentFixture<SuperChainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperChainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperChainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
