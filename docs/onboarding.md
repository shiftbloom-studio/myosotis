# Onboarding

## Supported Platforms

- `macOS` is the primary platform
- `Linux` is supported
- `Windows` is supported only through `WSL2`

## What the Bootstrap Does

The bootstrap scripts:

- install required CLI tools
- back up existing Codex and Claude files before overwriting managed targets
- sync Shiftbloom global templates
- sync Shiftbloom skills into Codex, Claude, and `~/.agents/skills`
- optionally render local environment files from AWS Secrets Manager

## Recommended Flow

1. Authenticate with AWS SSO or another approved AWS access path.
2. Run the platform-specific bootstrap script from `bootstrap/`.
3. Run `checks/verify-global-setup.sh`.
4. Open a reference product repository and run `bootstrap/sync-project.sh`.
5. Run `checks/verify-project-setup.sh` inside that repository.

## Local Authentication Expectations

- Claude:
  - local developers use `claude /login`
- Codex:
  - local developers use `codex --login`
- GitHub:
  - local developers use `gh auth login`

The shared stack does not depend on these local logins because it uses service-account credentials from Secrets Manager.

