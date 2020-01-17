import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformControlPageComponent } from './perform-control-page.component';

describe('PerformControlPageComponent', () => {
  let component: PerformControlPageComponent;
  let fixture: ComponentFixture<PerformControlPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformControlPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
