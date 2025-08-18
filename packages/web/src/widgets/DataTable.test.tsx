import {describe, expect, jest, test} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/react';
import type {Column} from './DataTable';
import {DataTable} from './DataTable';

describe('dataTable', () => {
  test('renders, handles click and loading/empty', () => {
    type Row = {id: number; name: string};
    const data: Array<Row> = [{id: 1, name: 'N'}];
    const columns: Array<Column<Row>> = [
      {key: 'name', header: 'Name', align: 'right'},
    ];
    const onRowClick = jest.fn();
    const {rerender} = render(
      <DataTable columns={columns} data={data} onRowClick={onRowClick} />,
    );
    fireEvent.click(screen.getByText('N'));
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, name: 'N'}),
    );
    rerender(<DataTable columns={columns} data={[]} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    rerender(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('uses row-index key path when items have no id', () => {
    type Row = {name: string};
    const data: Array<Row> = [{name: 'X'}]; // no id triggers `row-${index}` branch
    const columns: Array<Column<Row>> = [{key: 'name', header: 'Name'}];
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('X')).toBeInTheDocument();
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
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('R-X-0')).toBeInTheDocument();
    expect(screen.getByText('R-Y-1')).toBeInTheDocument();
  });
});
