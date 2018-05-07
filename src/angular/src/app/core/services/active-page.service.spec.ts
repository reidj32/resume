import { TestBed, inject } from '@angular/core/testing';

import { ActivePageService } from './active-page.service';

describe('ActivePageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivePageService]
    });
  });

  it('should be created', inject([ActivePageService], (service: ActivePageService) => {
    expect(service).toBeTruthy();
  }));
});
