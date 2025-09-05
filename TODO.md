- [ ] audit all the eslint-disable rules that AI added; make sure they're not
      for stupid reasons
- [ ] where possible, use user-event instead of fireEvent
- [ ] jest - configure clearAllMocks (or better?) in the jest config so it
      doesn't have to be set everwhere
- [ ] refine landing => sign-up/login flow
- [ ] scan repo for strings that haven't been internationalized
- [ ] add secret detection to precommit hook:
      https://docs.gitguardian.com/ggshield-docs/integrations/git-hooks/pre-commit
- [ ] add cursor ignore file?
- [ ] Feature: Chore Scheduling/Rotation
  - [ ] as needed
  - [ ] daily/weekly, etc.
- [ ] Feature: Photo/Video Proof
- [ ] Feature: disallow late chores
- [ ] Feature: late penalty
- [ ] add date-fns
- [ ] remove build step from api package
- [ ] esm all the packages
- [ ] setup typescript-coverage-report?
- [ ] add eslint rule to enforce that unawaited promises are assigned to a
      variable named /promise$/i
- [x] badges for git repo
  - [x] test coverage
  - [x] dependencies up to date
  - [x] build passing
  - [x] code climate maintainability
