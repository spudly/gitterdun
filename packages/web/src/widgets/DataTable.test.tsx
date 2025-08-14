import {render, screen, fireEvent} from '@testing-library/react';
import {DataTable, Column} from './DataTable';

describe('DataTable', () => {
  it('renders, handles click and loading/empty', () => {
    interface Row {
      id: number;
      name: string;
    }
    const data: Row[] = [{id: 1, name: 'N'}];
    const columns: Column<Row>[] = [
      {key: 'name', header: 'Name', className: 'text-right'},
    ];
    const onRowClick = jest.fn();
    const {rerender} = render(
      <DataTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
        rowClassName={() => 'row'}
      />,
    );
    fireEvent.click(screen.getByText('N'));
    expect(onRowClick).toHaveBeenCalled();
    rerender(<DataTable data={[]} columns={columns} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    rerender(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('uses row-index key path when items have no id', () => {
    type Row = {name: string};
    const data: Row[] = [{name: 'X'}]; // no id triggers `row-${index}` branch
    const columns: Column<Row>[] = [{key: 'name', header: 'Name'}];
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('uses custom column render when provided', () => {
    type Row = {name: string};
    const data: Row[] = [{name: 'X'}, {name: 'Y'}];
    const columns: Column<Row>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (item, index) => `R-${item.name}-${index}`,
      },
    ];
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText('R-X-0')).toBeInTheDocument();
    expect(screen.getByText('R-Y-1')).toBeInTheDocument();
  });
});
