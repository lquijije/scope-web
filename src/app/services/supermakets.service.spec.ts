import { TestBed } from '@angular/core/testing';

import { SupermaketsService } from './supermakets.service';

describe('SupermaketsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupermaketsService = TestBed.get(SupermaketsService);
    expect(service).toBeTruthy();
  });
});
