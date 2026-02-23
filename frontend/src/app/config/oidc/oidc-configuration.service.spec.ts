import { TestBed } from '@angular/core/testing';

import { OidcConfigurationService } from './oidc-configuration.service';
import { OidcConfiguration } from './oidc-configuration';

describe('OidcConfigurationService', () => {
  let service: OidcConfigurationService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OidcConfigurationService);
    fetchMock = jest.fn();
    (globalThis as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return oidc configuration on success', async () => {
    const oidcConfiguration: OidcConfiguration = createOidcConfiguration();
    fetchMock.mockResolvedValue(createResponse({ jsonValue: oidcConfiguration }));

    const result: OidcConfiguration = await service.getOidcConfiguration$();

    expect(result).toEqual(oidcConfiguration);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should retry when endpoint returns 502 before succeeding', async () => {
    const oidcConfiguration: OidcConfiguration = createOidcConfiguration();
    fetchMock.mockResolvedValueOnce(createResponse({ ok: false, status: 502, statusText: 'Bad Gateway' }));
    fetchMock.mockResolvedValueOnce(createResponse({ jsonValue: oidcConfiguration }));

    const result: OidcConfiguration = await service.getOidcConfiguration$();

    expect(result).toEqual(oidcConfiguration);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should throw when endpoint returns non-json content type', async () => {
    fetchMock.mockResolvedValue(createResponse({ contentType: 'text/html' }));

    await expect(service.getOidcConfiguration$())
      .rejects
      .toThrow("OIDC configuration endpoint returned unexpected content type 'text/html'.");
  });

  it('should throw immediately when endpoint returns a non transient status', async () => {
    fetchMock.mockResolvedValue(createResponse({ ok: false, status: 401, statusText: 'Unauthorized' }));

    await expect(service.getOidcConfiguration$())
      .rejects
      .toThrow('Could not load OIDC configuration (401 Unauthorized).');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

function createOidcConfiguration(): OidcConfiguration {
  return {
    clientId: 'burning-okr-frontend',
    issuerUri: 'https://issuer.example.com',
    scopes: ['openid', 'profile'],
    strictDiscoveryDocumentValidation: false,
  };
}

interface MockResponseParameters {
  contentType?: string;
  jsonValue?: OidcConfiguration;
  ok?: boolean;
  status?: number;
  statusText?: string;
}

function createResponse({
  contentType = 'application/json',
  jsonValue = createOidcConfiguration(),
  ok = true,
  status = 200,
  statusText = 'OK',
}: MockResponseParameters): Response {
  return {
    ok,
    status,
    statusText,
    headers: {
      get: (name: string): string | null => {
        if (name === 'content-type') {
          return contentType;
        }

        return null;
      },
    },
    json: async () => jsonValue,
  } as Response;
}
