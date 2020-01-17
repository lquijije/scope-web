import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportPageComponent } from './visit-report-page.component';

describe('VisitReportPageComponent', () => {
  let component: VisitReportPageComponent;
  let fixture: ComponentFixture<VisitReportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitReportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
