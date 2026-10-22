# Dependency security

Use Node.js 24.22.1 LTS or a newer patched 24.x release. `.nvmrc` is the
shared version used by both CI workflows. The lockfile records the installed
package versions; use `npm ci` to reproduce them.

## Checks

- `npm audit`: includes development tools and reports all known findings.
- `npm audit --omit=dev --audit-level=low`: CI gate for production dependencies.
- `npm run lint` and `npm run build`: lint, type checking, and static export.
- CI checks both an empty `URL_PREFIX` and `URL_PREFIX=NewTab`.

## Known development-only finding (2026-10-22)

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects `braces` through 3.0.3. No patched release is available. It is brought
in by `eslint-config-next -> @next/eslint-plugin-next -> fast-glob ->
micromatch -> braces`. npm audit counts this single advisory across five
packages, all development-only. Deeply nested attacker-controlled glob
patterns can terminate a Node.js process. The lint configuration uses local
repository paths; these tools are not shipped in the static browser bundle.
Do not feed untrusted patterns to this lint toolchain. Review the full audit
when upgrading and remove this note when the upstream fix is available.

`compression` is overridden to `^1.8.2` because `serve@14.2.6` pins the
vulnerable 1.8.1 release. Remove the override once `serve` includes the fix.

Next.js 16.4 supports ESLint 10, but some bundled plugins still declare peer
ranges ending at ESLint 9. npm can emit peer warnings during installation;
CI verifies the installed lint configuration actually runs. React 18 remains
supported by Next.js 16, with a deprecation warning for the next major.
