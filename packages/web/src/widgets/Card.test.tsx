import {render, screen} from '@testing-library/react';
import {Card} from './Card';

describe('Card', () => {
  it('renders header/footer', () => {
    render(
      <Card header={<div>H</div>} footer={<div>F</div>}>
        C
      </Card>,
    );
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
  });

  it('applies default padding and elevation', () => {
    render(<Card>Default</Card>);
    const inner = screen.getByText('Default');
    expect(inner).toHaveClass('p-6');
    const outer = inner.parentElement as HTMLElement;
    expect(outer).toHaveClass('shadow');
  });

  it('respects padded=false and elevated=false', () => {
    render(
      <Card padded={false} elevated={false}>
        Cond
      </Card>,
    );
    const inner = screen.getByText('Cond');
    expect(inner).not.toHaveClass('p-6');
    const outer = inner.parentElement as HTMLElement;
    expect(outer).toHaveClass('border');
  });
});
