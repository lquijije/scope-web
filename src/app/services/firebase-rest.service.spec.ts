import { TestBed } from '@angular/core/testing';

import { FirebaseRestService } from './firebase-rest.service';

describe('FirebaseRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseRestService = TestBed.get(FirebaseRestService);
    expect(service).toBeTruthy();
  });
});
