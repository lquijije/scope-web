import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantImagesComponent } from './mant-images.component';

describe('MantImagesComponent', () => {
  let component: MantImagesComponent;
  let fixture: ComponentFixture<MantImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
