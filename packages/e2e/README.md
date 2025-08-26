# E2E Tests

End-to-end tests for the GitTerDun application using Playwright.

## Prerequisites

- Node.js 22.18.0 or higher
- The application servers (API and Web) should be running locally

## Installation

Install Playwright browsers:

```bash
npm run install:browsers --workspace=packages/e2e
```

Or from the root:

```bash
npm run install:browsers
```

## Running Tests

### Command Line

Run all tests:

```bash
npm test --workspace=packages/e2e
```

Run tests with UI mode:

```bash
npm run test:ui --workspace=packages/e2e
```

Run tests in debug mode:

```bash
npm run test:debug --workspace=packages/e2e
```

Run tests in headed mode (see browser):

```bash
npm run test:headed --workspace=packages/e2e
```

### From Root Directory

```bash
npm run test:e2e          # Run all e2e tests
npm run test:e2e:ui       # Run with UI mode
npm run test:e2e:debug    # Run in debug mode
```

## Test Structure

### Test Files

- `tests/auth.spec.ts` - Authentication flow tests (login, register)
- `tests/family.spec.ts` - Family management tests (create family, add children)
- `tests/chores.spec.ts` - Chore workflow tests (create, assign, complete,
  approve)
- `tests/leaderboard.spec.ts` - Leaderboard and points system tests

### Test Data

Tests use unique timestamps to avoid conflicts when running multiple times. Each
test creates its own users and families to ensure isolation.

## Configuration

The tests are configured to:

- Run against `http://localhost:8000` (web) and `http://localhost:8001` (API)
- Automatically start the development servers if not already running
- Support multiple browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile
  Safari
- Take screenshots on failure
- Generate HTML reports
- Retry failed tests twice in CI

## CI Integration

E2E tests run automatically in GitHub Actions:

1. After the build step completes
2. Browsers are installed automatically
3. Test results and reports are uploaded as artifacts
4. Tests run on every pull request

## Writing New Tests

When writing new tests:

1. Use unique identifiers (timestamps) for test data
2. Clean up test data where possible
3. Use helper functions to avoid code duplication
4. Follow the existing pattern of setting up families and users
5. Use descriptive test names and organize tests in logical groups

## Debugging

To debug tests locally:

1. Run tests in headed mode to see the browser
2. Use debug mode to step through tests
3. Check the HTML report for detailed failure information
4. Use browser developer tools when running in headed mode

## Browser Support

Tests run on:

- Desktop: Chrome, Firefox, Safari (WebKit)
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

Additional browsers can be configured in `playwright.config.ts`.
