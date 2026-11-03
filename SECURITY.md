# Dependency security

Use Node.js 24.22.1 LTS or a newer patched 24.x release. `.nvmrc` is the
shared version used by both CI workflows. The lockfile records the installed
package versions; use `npm ci` to reproduce them.

## Checks

- `npm audit`: includes development tools and reports all known findings.
- `npm audit --include=dev --audit-level=low`: CI gate for production and development dependencies.
- `npm run lint` and `npm run build`: lint, type checking, and static export.
- CI checks both an empty `URL_PREFIX` and `URL_PREFIX=NewTab`.

## Next.js security update (2026-11-03)

Next.js and `eslint-config-next` are pinned to 16.4.5, with matching resolved
dependencies in `package-lock.json`. The [official 16.4.5 release](https://github.com/vercel/next.js/releases/tag/v16.4.5)
lists seven security fixes covering server caches, forwarded responses, image
optimization, and Edge runtime response headers. Some linked advisories still
list no patched version; the release announcement explicitly includes the fixes.

This app uses the Pages Router with `output: 'export'`. The GitHub Pages workflow
publishes only `out/`; it does not run a Next.js server. There are no App Router
cache functions, API routes, Edge routes, or uses of the default `next/image`
optimizer in the app. The server-side exploitation conditions described in these
advisories are therefore absent from this static deployment. This assessment does
not cover a separately exposed development server or a future server deployment.
Keep the dependency update even though the current static site does not expose
the affected server functionality.

Validation on Node.js 24.22.1: `npm ci`, lint, and static builds with both URL
prefixes passed. Lint retains one existing `@next/next/no-img-element` warning.
`npm audit --include=dev --audit-level=low` currently fails with 17 moderate
findings propagated from [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
in the development tooling, including ESLint and `serve`. This is separate from
the Next.js fixes and still blocks the audit CI gate. npm proposes a breaking
ESLint downgrade; no forced audit fix or broad dependency changes were applied.
The lockfile-only audit reports the same 17 moderate findings; the production-only
audit (`npm audit --omit=dev --audit-level=low`) reports zero vulnerabilities.

## Audit status (2026-10-25)

Both `npm audit` and `npm audit --package-lock-only` report zero known
vulnerabilities, including development dependencies.

The previously reported [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
for `braces` was withdrawn on 2026-10-23 because it is not practically
exploitable. Its five propagated npm audit findings are no longer reported.
`braces@3.0.3` remains in the lint dependency tree; no dependency override or
rule removal was needed to clear these findings. CI now audits development
dependencies as well as production dependencies.

`compression` is overridden to `^1.8.2` because `serve@14.2.6` pins the
vulnerable 1.8.1 release. Remove the override once `serve` includes the fix.

Next.js 16.4 supports ESLint 10, but some bundled plugins still declare peer
ranges ending at ESLint 9. npm can emit peer warnings during installation;
CI verifies the installed lint configuration actually runs. React 18 remains
supported by Next.js 16, with a deprecation warning for the next major.

## Dependabot

Dependabot alerts and security update pull requests are enabled on GitHub.
`.github/dependabot.yml` checks npm (including development dependencies) and
GitHub Actions for version updates every Monday at 09:00 Asia/Tokyo. Security
update PRs are triggered by alerts independently of that weekly schedule.

Next.js, its ESLint config, React, and React type definitions are grouped for
compatible review. Other minor/patch updates are grouped; other major updates
remain separate PRs. npm security updates have their own group. Version PRs
are limited to five per ecosystem. All PRs run the existing audit, lint, and
static builds for both URL prefixes before review and merge. Auto-merge is
not enabled by this setup.

Dependabot does not update the Node.js version in `.nvmrc`; review Node.js
security releases separately and update that file when needed.
