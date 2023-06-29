# Magic Ticket

[![CI](https://github.com/spenserblack/actions-magic-ticket/actions/workflows/ci.yml/badge.svg)](https://github.com/spenserblack/actions-magic-ticket/actions/workflows/ci.yml)
[![Check dist/](https://github.com/spenserblack/actions-magic-ticket/actions/workflows/check-dist.yml/badge.svg)](https://github.com/spenserblack/actions-magic-ticket/actions/workflows/check-dist.yml)
[![codecov](https://codecov.io/gh/spenserblack/actions-magic-ticket/branch/main/graph/badge.svg?token=e5VgzjbqMy)](https://codecov.io/gh/spenserblack/actions-magic-ticket)

Congratulate a user when they get the magic issue/PR/discussion number.

## Example

```yaml
# See https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
# for more details. Some good triggers are opened issues, opened pull requests, and
# created discussions
on:
  issues:
    types: [opened]

job:
  congratulations:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: spenserblack/actions-magic-ticket@main
        with:
          regex: "\\d00$"
          message: |
            Congratulations @{{ actor }} on submitting issue #{{ number }}! :tada:
```

The above workflow would generate a comment that looks something like this:

```markdown
Congratulations @octocat on submitting issue #100! :tada:
```

## Inputs

### `regex`

As stated in the example, this is matched against reference number of the issue,
pull request, or discussion that triggered the workflow. Obviously, this value
will always be numeric, so be careful to avoid regular expressions that will
never match!

### `message`

A nunjucks template. See [nunjucks][template-engine] for more information.

#### Variables

- `actor`: The user that triggered this workflow (e.g. the issue creator)
- `number`: The reference number for the issue, discussion, or pull request

[template-engine]: https://mozilla.github.io/nunjucks/
