# Git Commit Guidelines

This document establishes commit message standards for the Dash Torrent Tracker project.

## Commit Message Format

```
verb(scope): brief description
```

**Examples:**
```
feat(auth): add OAuth support
fix(ui): resolve button alignment issue
refactor(torrent): lift modal state to parent component
```

## Rules

1. **One line** — keep commits brief and focused
2. **English only** — this is an open source Dash project
3. **Lowercase** — verb and scope in lowercase
4. **No period** — don't end with a period
5. **Imperative mood** — "add feature" not "added feature"

## Verbs

| Verb | Use case | Example |
|------|----------|---------|
| `feat` | New feature | `feat(wallet): add disconnect button` |
| `fix` | Bug fix | `fix(table): correct sorting order` |
| `refactor` | Code restructuring (no behavior change) | `refactor(modal): extract to separate component` |
| `style` | Styling, CSS, formatting | `style(toast): add dark mode support` |
| `chore` | Dependencies, configs, tooling | `chore(deps): update react to v19` |
| `docs` | Documentation | `docs(readme): add setup instructions` |
| `clean` | Remove unused code/files | `clean(src): remove deprecated components` |
| `improve` | Enhancement to existing feature | `improve(ux): add loading skeleton` |
| `optimize` | Performance improvements | `optimize(query): add pagination` |

## Scope

Scope indicates the affected area:

- **Module names:** `wallet`, `torrent`, `shared`
- **Component types:** `ui`, `api`, `config`
- **Specific components:** `sidebar`, `modal`, `table`

## When to Use Multi-line Commits

For most changes, single-line commits are sufficient. Use multi-line commits only for:

- Breaking changes
- Complex refactoring that needs explanation
- Closing GitHub issues

**Multi-line format:**
```
verb(scope): brief description

- Detail about the change
- Another detail

Closes #123
```

## Atomic Commits

- **One logical change per commit** — don't mix features, fixes, and refactoring
- **Keep it buildable** — each commit should compile and run
- **Related files together** — if changes are interdependent, commit them together

## Bad Examples

```
# Too vague
fix: fixed stuff

# Too long
feat(authentication-module): implemented complete OAuth 2.0 flow with refresh tokens and session management

# Mixed concerns
feat(ui): add button and fix header and update deps

# Wrong language
feat(wallet): добавил кнопку отключения
```

## Good Examples

```
feat(sidebar): add category filter
fix(modal): prevent close on backdrop click
refactor(torrent): use outlet context for state
style(footer): add responsive layout
clean(deps): remove unused packages
```
