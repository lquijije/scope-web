import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantFixesComponent } from './mant-fixes.component';

describe('MantFixesComponent', () => {
  let component: MantFixesComponent;
  let fixture: ComponentFixture<MantFixesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantFixesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantFixesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
