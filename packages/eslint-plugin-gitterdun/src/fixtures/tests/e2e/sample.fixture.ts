// playwright usages for data-testid
// page.getByTestId('e2e-used')
// page.locator('[data-testid="locator-used"]')
// page.locator("[data-testid='locator-sq-used']")
// page.locator('[data-testid=e2eNoQuotes]')

export const e2eFixture = `
  page.getByTestId('e2e-used');
  page.locator('[data-testid="locator-used"]');
  page.locator("[data-testid='locator-sq-used']");
  page.locator('[data-testid=e2eNoQuotes]');
`;
