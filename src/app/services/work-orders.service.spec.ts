import { TestBed } from '@angular/core/testing';

import { WorkOrdersService } from './work-orders.service';

describe('WorkOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkOrdersService = TestBed.get(WorkOrdersService);
    expect(service).toBeTruthy();
  });
});
