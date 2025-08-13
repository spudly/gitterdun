import {test, expect} from '@playwright/test';

test('Card/Badge/StatusDot/Spinner demos render', async ({page}) => {
  for (const name of ['Card', 'Badge', 'StatusDot', 'Spinner']) {
    await page.goto(`/__demos/${name}`);
    await expect(page.getByTestId(`${name}Demo`)).toBeVisible();
  }
});

test('ListRow/StatCard/PageHeader/EmptyState/Avatar demos render', async ({
  page,
}) => {
  for (const name of [
    'ListRow',
    'StatCard',
    'PageHeader',
    'EmptyState',
    'AvatarCircle',
  ]) {
    await page.goto(`/__demos/${name}`);
    await expect(page.getByTestId(`${name}Demo`)).toBeVisible();
  }
});
