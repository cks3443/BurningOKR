<p align="center"><img src="/docs/ci/Logo_burningOKR_RGB_web.png" width="35%" height="35%" alt="Burning OKR"/></p>

<br/><br/><br/>

# BurningOKR

Burning OKR is our vision to help consistently establish focus and alignment around company goals and embed transparency into the corporate culture.

BurningOKR has been developed as a web application with an Angular Frontend and Java Spring Boot Backend. As a database, Postgres SQL is used.

## Installation

When you have Docker and Docker Compose installed you can proceed with the next steps.

1. Open the `docker` directory.
2. Copy [backend.env.sample](/docker/backend.env.sample) to `backend.env`.
3. Copy [postgres.env.sample](/docker/postgres.env.sample) to `postgres.env`.
4. Edit both files and set secure production values.
5. Start the stack with `docker compose up -d --build`.
6. Open `http://localhost` in your browser.

Notes:
- `SYSTEM_CONFIGURATION_PROVIDER` in `backend.env` must match your identity provider (`keycloak` or `azureAD`).
- `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` and `SYSTEM_CONFIGURATION_ISSUER_URI` must point to the same issuer realm/tenant.
- If you do not use SMTP, keep the `SPRING_MAIL_*` lines commented.

## Development

When you want to contribute to BurningOKR or develop something for yourself please refer to the [development readme](/docs/development.md).

## FAQ

- **I have BurningOKR running in a Tomcat, should i migrate to Docker?**  
  Yes you should. We will only support the docker images. When you want to use Tomcat you
  can do so, but we will offer no support.

- **I get some errors with npm install (python2, node-sass, node-gyp):**  
  Use the LTS version of node, not the current! <https://nodejs.org/en/download/>

## Contact

You can write an [E-Mail](mailto:burningokr@brockhaus-ag.de) or mention our Twitter account [@BurningOKR](https://twitter.com/BurningOkr).

## License

BurningOKR was initially developed as part of a training project at [BROCKHAUS AG](http://brockhaus-ag.de) in Lünen.

Only an Open Source solution can unfold its true potential. That's why we released it on GitHub as an open-source project under the Apache 2.0 license.

See [LICENSE.txt](LICENSE.txt)
