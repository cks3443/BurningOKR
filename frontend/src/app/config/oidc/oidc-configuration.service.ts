import { Injectable } from '@angular/core';
import { OidcConfiguration } from './oidc-configuration';

@Injectable({
  providedIn: 'root'
})
export class OidcConfigurationService {
  private static readonly MAX_RETRIES: number = 5;
  private static readonly BASE_RETRY_DELAY_MS: number = 500;
  private static readonly TRANSIENT_STATUS_CODES: number[] = [502, 503, 504];
  private static readonly OIDC_CONFIGURATION_URL: string = '/applicationSettings/oidcConfiguration';

  async getOidcConfiguration$(): Promise<OidcConfiguration> {
    // Usage of fetch is needed to avoid a circular dependency:
    // AuthService -> OidcConfigService -> HTTP-Client -> OAuthInterceptor --
    //      ^                                                                |
    //      |                                                                |
    //      -----------------------------------------------------------------
    let lastError: Error = new Error('Could not load OIDC configuration.');

    for (let attempt: number = 1; attempt <= OidcConfigurationService.MAX_RETRIES; attempt++) {
      try {
        const response: Response = await fetch(`${window.location.origin}${OidcConfigurationService.OIDC_CONFIGURATION_URL}`);
        const oidcConfiguration: OidcConfiguration = await this.extractOidcConfiguration(response);

        return oidcConfiguration;
      } catch (error: unknown) {
        lastError = this.convertToError(error);
        const isLastAttempt: boolean = attempt === OidcConfigurationService.MAX_RETRIES;

        if (isLastAttempt || !this.isTransientError(lastError)) {
          throw lastError;
        }
      }

      await this.delay(attempt);
    }

    throw lastError;
  }

  private async extractOidcConfiguration(response: Response): Promise<OidcConfiguration> {
    if (!response.ok) {
      throw new Error(
        `Could not load OIDC configuration (${response.status} ${response.statusText || 'Unknown Error'}).`
      );
    }

    const contentType: string = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      throw new Error(
        `OIDC configuration endpoint returned unexpected content type '${contentType || 'unknown'}'.`
      );
    }

    return response.json();
  }

  private isTransientError(error: Error): boolean {
    if (error.message.includes('Failed to fetch')) {
      return true;
    }

    return OidcConfigurationService.TRANSIENT_STATUS_CODES.some((statusCode: number) => {
      return error.message.includes(`(${statusCode} `);
    });
  }

  private convertToError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error('Could not load OIDC configuration.');
  }

  private async delay(attempt: number): Promise<void> {
    const milliseconds: number = attempt * OidcConfigurationService.BASE_RETRY_DELAY_MS;

    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
  }
}
