import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangePassPageComponent } from './user-change-pass-page.component';

describe('UserChangePassPageComponent', () => {
  let component: UserChangePassPageComponent;
  let fixture: ComponentFixture<UserChangePassPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChangePassPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangePassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
