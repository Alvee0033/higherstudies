import { ServiceUnavailableException } from '@nestjs/common';

export function assertPublicCatalogueReleased(
  env: Record<string, string | undefined> = process.env,
): void {
  if (env.NODE_ENV === 'production' && env.PUBLIC_CATALOGUE_RELEASED !== 'true') {
    throw new ServiceUnavailableException(
      'The public catalogue is unavailable until its data release is approved.',
    );
  }
}
