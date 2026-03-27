# #096: OAuth2 Social Login Integration Expansion

**Category:** [BACKEND]
**Difficulty:** ● MEDIUM
**Tags:** `oauth2`, `auth`, `passport`, `google`, `github`, `security`

## Description

Expand the authentication system to support OAuth2 social login (Google and GitHub). This allows users to register and log in to the PayD platform using their existing social accounts, streamlining the onboarding process.

## Acceptance Criteria

- [ ] Configure Passport.js strategies for Google and GitHub.
- [ ] Implement redirection and callback handlers.
- [ ] Link social accounts to existing database user profiles.
- [ ] Ensure that MFA (Multi-Factor Authentication) still applies for highly-sensitive actions even when using social login.
