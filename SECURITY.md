# Dependency security

Use Node.js 24.22.1 LTS or a newer patched 24.x release. `.nvmrc` is the
shared version used by both CI workflows. The lockfile records the installed
package versions; use `npm ci` to reproduce them.

## Checks

- `npm audit`: includes development tools and reports all known findings.
- `npm audit --include=dev --audit-level=low`: CI gate for production and development dependencies.
- `npm run lint` and `npm run build`: lint, type checking, and static export.
- CI checks both an empty `URL_PREFIX` and `URL_PREFIX=NewTab`.

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
