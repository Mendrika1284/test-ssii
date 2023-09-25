## Back (server)

The back-end and the web server are combined in one process.

The web service is provided by [Moleculer](https://moleculer.services).

Moleculer serves:

- static content (especially the Single Page Application provided by the front,
  available under `/` on the website)
- REST API services served by `moleculer-web` (defined inside `./routes/*`)
- Swagger Documentation for APIs (under `/doc`
  on the website)

### Sub-directories

- `config/` contains the configurations for each environment (defined using the
  `NODE_CONFIG_ENV` environment variable)
- `lib/` contains shared functions
- `mixins/` contains definitions of the Moleculer micro-services
- `routes/` contains definitions of the REST APIs
