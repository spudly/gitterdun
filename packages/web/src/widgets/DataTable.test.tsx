import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {Column} from './DataTable';
import {DataTable} from './DataTable';
import {createWrapper} from '../test/createWrapper';

describe('dataTable', () => {
  test('renders, handles click and loading/empty', async () => {
    type Row = {id: number; name: string};
    const data: Array<Row> = [{id: 1, name: 'N'}];
    const columns: Array<Column<Row>> = [
      {key: 'name', header: 'Name', align: 'right'},
    ];
    const onRowClick = jest.fn();
    const Wrapper = createWrapper({i18n: true});
    const {rerender} = render(
      <DataTable columns={columns} data={data} onRowClick={onRowClick} />,
      {wrapper: Wrapper},
    );
    await userEvent.click(screen.getByText('N'));
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, name: 'N'}),
      0, // index parameter
    );
    rerender(<DataTable columns={columns} data={[]} loading />);
    expect(screen.getByText('Loading...')).toHaveTextContent('Loading...');
    rerender(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toHaveTextContent(
      'No data available',
    );
  });

  test('uses row-index key path when items have no id', () => {
    type Row = {name: string};
    const data: Array<Row> = [{name: 'X'}]; // no id triggers `row-${index}` branch
    const columns: Array<Column<Row>> = [{key: 'name', header: 'Name'}];
    const Wrapper = createWrapper({i18n: true});
    render(<DataTable columns={columns} data={data} />, {wrapper: Wrapper});
    expect(screen.getByText('X')).toHaveTextContent('X');
  });

  test('uses custom column render when provided', () => {
    type Row = {name: string};
    const data: Array<Row> = [{name: 'X'}, {name: 'Y'}];
    const columns: Array<Column<Row>> = [
      {
        key: 'name',
        header: 'Name',
        render: (item, index) => `R-${item.name}-${index}`,
      },
    ];
    const Wrapper = createWrapper({i18n: true});
    render(<DataTable columns={columns} data={data} />, {wrapper: Wrapper});
    expect(screen.getByText('R-X-0')).toHaveTextContent('R-X-0');
    expect(screen.getByText('R-Y-1')).toHaveTextContent('R-Y-1');
  });
});
