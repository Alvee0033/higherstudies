import { ServiceUnavailableException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { assertPublicCatalogueReleased } from './public-catalogue-release.js';

describe('public catalogue release gate', () => {
  it('blocks catalogue reads in production until the data release is approved', () => {
    expect(() => assertPublicCatalogueReleased({ NODE_ENV: 'production' }))
      .toThrow(ServiceUnavailableException);
  });

  it('allows production catalogue reads after an explicit release approval', () => {
    expect(() => assertPublicCatalogueReleased({
      NODE_ENV: 'production',
      PUBLIC_CATALOGUE_RELEASED: 'true',
    })).not.toThrow();
  });

  it('keeps local development catalogue reads available', () => {
    expect(() => assertPublicCatalogueReleased({ NODE_ENV: 'development' }))
      .not.toThrow();
  });
});
