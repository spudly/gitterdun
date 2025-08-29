// react-testing-library usages for data-testid
// screen.getByTestId('used-id')
// getAllByTestId('used-all')
// within(section).getByTestId('within-used')
// render(...).getByTestId('render-used')

export const unitFixture = `
  screen.getByTestId('used-id');
  getAllByTestId('used-all');
  within(section).getByTestId('within-used');
  render(<div/>).getByTestId('render-used');
  screen.getByTestId('has-"quotes"');
  screen.getByTestId("has-'quotes'");
`;
