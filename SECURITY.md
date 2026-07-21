# Security

## Current demo model

LeadFlow is currently a static portfolio demonstration. It has no server, shared database, user accounts, payment flow, or private API keys.

- All included contacts and companies are fictional demonstration data.
- Changes are stored only in the visitor's browser using local storage.
- No visitor data is transmitted to a server.
- The demo must not be used to store passwords, payment details, identity documents, or real confidential client information.

## Before production use

A production version must add authenticated access, server-side authorization, database row-level security, input validation, secure server-side secret storage, rate limiting, audit logs, dependency monitoring, and tested backups.
