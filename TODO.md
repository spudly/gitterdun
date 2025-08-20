- [x] extract all html elements w/ tailwind classes to widgets
- [x] use clsx for concatenating classnames
- [x] setup the react compiler eslint plugin
- [x] cleanup eslint configuration, merging other configs into a single unified
      config
- [x] write jest tests => 100% coverage
- [x] IconButton demo has duplicate code (SVGs). Clean that up and make sure
      other stuff isn't duplicated.
- [x] Use padding/gap. Do not use margins
- [x] Use `test` instead of `it` for jest tests. maybe there's a eslint rule for
      this
- [x] add depcheck
- [x] comment reasons for disabling eslint rules
  - [x] stylistic rules not necessary because of prettier
  - [x] add unused eslint rules
- [x] use types, not interfaces
- [x] prettier-plugin-tailwindcss
- [x] eslint-plugin-tailwindcss
- [x] re-enable import/max-dependencies
- [x] re-enable react/jsx-max-depth
- [x] add eslint-plugin-jest
- [x] format SQL using prettier-plugin-embed + prettier-plugin-sql
- [x] upgrade to express 5
- [x] update all dependencies
- [x] instruct cursor to always make sure that any new code it writes passes
      checks: eslint, jest, typescript, prettier
- [ ] audit all the eslint-disable rules that AI added; make sure they're not
      for stupid reasons
- [ ] where possible, use user-event instead of fireEvent
- [ ] jest - configure clearAllMocks (or better?) in the jest config so it
      doesn't have to be set everwhere
- [ ] setup react-i18n; include pig-latin & pirate-speak
- [ ] refine landing => sign-up/login flow
- [ ] add eslint-plugin-turbo
- [ ] scan repo for strings that haven't been internationalized
