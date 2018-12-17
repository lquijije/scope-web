import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManPageComponent } from './user-man-page.component';

describe('UserManPageComponent', () => {
  let component: UserManPageComponent;
  let fixture: ComponentFixture<UserManPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
