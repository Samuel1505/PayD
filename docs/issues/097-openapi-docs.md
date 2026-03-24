# #097: Add Swagger/OpenAPI Documentation

**Category:** [BACKEND]
**Difficulty:** ● EASY
**Tags:** `api`, `documentation`, `swagger`, `openapi`, `developer-experience`

## Description

Implement Swagger (using `swagger-jsdoc` and `swagger-ui-express`) to automatically generate and serve OpenAPI documentation for the backend API. This provides developers with an interactive environment to browse and test endpoints.

## Acceptance Criteria

- [ ] Add JSDoc comments to all existing Express routes.
- [ ] Configure the `/api-docs` endpoint to serve the Swagger UI.
- [ ] Ensure that authorization headers (JWT) can be tested directly from the UI.
- [ ] Export the generated `openapi.json` file for frontend client generation.
