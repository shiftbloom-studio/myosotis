# Operations

## Owners

- primary owner: technical lead at Shiftbloom Studio
- secondary owner: one designated fullstack engineer

## Rotation-Sensitive Areas

- `CADDY_BASIC_AUTH_USER`
- `CADDY_BASIC_AUTH_HASH`
- shared Claude credentials
- shared Codex credentials
- GitHub token for shared workflows
- RDS master password

## Backups

- RDS automated backups should be enabled
- the EC2 host only stores runtime data and cache under `ARCHON_DATA`
- compose files and templates remain fully reconstructible from git

## Update Policy

- all setup changes go through pull requests in this repository
- releases are versioned
- product repositories are updated via sync, not ad hoc manual edits

## Incident Handling

- use SSM to access the host
- verify health via `checks/verify-shared-stack.sh`
- inspect rendered environment file and docker logs
- rotate secrets in Secrets Manager if credentials are suspected
