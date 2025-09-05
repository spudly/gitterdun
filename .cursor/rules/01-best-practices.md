## Coding Best Practices for AI Edits

Follow these rules for every code change. Prefer clarity over cleverness and
refactor when needed to align with these principles.

### DRY (Don't Repeat Yourself)

- Avoid duplicating logic across files or functions.
- Extract shared behavior into reusable functions, modules, or components.
- Consolidate near-duplicate code paths behind a single well-named abstraction.

### Readability

- Optimize for human understanding first.
- Use clear control flow; avoid deeply nested logic.
- Prefer explicit code over implicit or surprising shortcuts.

### Meaningful Names

- Choose descriptive, unambiguous names that express intent.
- Name functions with verb phrases; name variables with concrete nouns.
- Avoid abbreviations unless they are universally understood.

### Simplicity (KISS)

- Keep implementations as simple as possible, but no simpler.
- Remove unnecessary layers, parameters, and indirection.
- Break complex changes into smaller, composable parts.

### Single Responsibility Principle (SRP)

- Each function/class/module should have one clear reason to change.
- Split multi-purpose functions into focused helpers.
- Encapsulate concerns rather than coupling unrelated behaviors.

### Small Functions

- Keep functions short and focused on a single task.
- Return early for guard conditions to reduce nesting.
- Prefer pure functions where practical.

### Avoid Magic Numbers/Strings

- Replace hardcoded values with named constants or enums.
- Centralize configuration and domain constants.
- Co-locate constants with the domain they describe when possible.

### Self-Documenting Code

- Make intent obvious through structure and naming.
- Reserve comments for non-obvious rationale and constraints.
- Prefer expressive types and well-factored APIs over explanatory comments.

### Principle of Least Astonishment

- Follow established project conventions and community idioms.
- Avoid side effects that are not clearly communicated by the API.
- Keep behavior predictable and consistent across similar code paths.

### Enforcement Expectations

- When editing code, opportunistically refactor to remove duplication and
  improve clarity within the touched scope.
- Prefer introducing small helpers over inlining complex logic.
- If a rule conflicts with existing local patterns, align with project-wide
  conventions and leave the code better than you found it.
