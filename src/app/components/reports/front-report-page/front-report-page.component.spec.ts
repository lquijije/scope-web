import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontReportPageComponent } from './front-report-page.component';

describe('FrontReportPageComponent', () => {
  let component: FrontReportPageComponent;
  let fixture: ComponentFixture<FrontReportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontReportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
