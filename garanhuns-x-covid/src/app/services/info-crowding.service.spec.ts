import { TestBed } from '@angular/core/testing';

import { InfoCrowdingService } from './info-crowding.service';

describe('InfoCrowdingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoCrowdingService = TestBed.get(InfoCrowdingService);
    expect(service).toBeTruthy();
  });
});
