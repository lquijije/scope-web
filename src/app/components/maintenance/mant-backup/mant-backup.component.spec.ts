import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantBackupComponent } from './mant-backup.component';

describe('MantBackupComponent', () => {
  let component: MantBackupComponent;
  let fixture: ComponentFixture<MantBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
