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
- [ ] add depcheck
- [ ] comment reasons for disabling eslint rules
  - [x] stylistic rules not necessary because of prettier
  - [x] add unused eslint rules
- [x] use types, not interfaces
- [x] prettier-plugin-tailwindcss
- [x] eslint-plugin-tailwindcss
- [ ] re-enable react/jsx-max-depth, import/max-dependencies
- [x] add eslint-plugin-jest
- [x] format SQL using prettier-plugin-embed + prettier-plugin-sql
- [ ] upgrade to express 5
- [ ] update all dependencies
- [x] instruct cursor to always make sure that any new code it writes passes
      checks: eslint, jest, typescript, prettier
- [ ] audit all the eslint-disable rules that AI added; make sure they're not
      for stupid reasons
