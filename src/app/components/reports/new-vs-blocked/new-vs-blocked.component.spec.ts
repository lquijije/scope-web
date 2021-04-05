import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVsBlockedComponent } from './new-vs-blocked.component';

describe('NewVsBlockedComponent', () => {
  let component: NewVsBlockedComponent;
  let fixture: ComponentFixture<NewVsBlockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVsBlockedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVsBlockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
