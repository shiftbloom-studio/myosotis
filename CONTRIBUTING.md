# Contributing to Myosotis

Thanks for contributing.

Myosotis is designed to stay easy to fork, inspect, and self-host, so contributions should preserve that bias toward simplicity and readable files.

## Development Setup

```bash
cd web
npm install
npm run dev
```

Before opening a pull request, run:

```bash
cd web
npm run lint
npm run build
```

## What We Accept

- bug fixes
- usability improvements
- documentation upgrades
- starter-pack improvements in `skills/`, `mcp/`, and `templates/`
- deployment and self-hosting improvements

## Contribution Guidelines

- Keep file-based workflows human-readable.
- Prefer explicit configuration over hidden magic.
- Avoid shipping secrets, private tokens, or org-internal credentials.
- If you add organization-specific starter content, label it clearly as example content.
- When changing the UI, preserve the Myosotis product identity and the small Shiftbloom attribution.

## Pull Request Checklist

- The change has a clear user-facing reason.
- The README or docs are updated if behavior changed.
- `npm run lint` passes.
- `npm run build` passes.
- New files and names are generic enough for open-source reuse.

## Good First Contributions

- improve error states
- add starter MCP profiles
- add starter skill packs
- refine deployment docs
- tighten copy and onboarding

## Questions

Open an issue or start with [SUPPORT.md](./SUPPORT.md).
