import {render, screen} from '@testing-library/react';
import {PageContainer} from './PageContainer';

describe('PageContainer', () => {
  it('renders variants', () => {
    const {rerender} = render(
      <PageContainer variant="centered">
        <div>c</div>
      </PageContainer>,
    );
    expect(screen.getByText('c')).toBeInTheDocument();
    rerender(
      <PageContainer variant="wide">
        <div>w</div>
      </PageContainer>,
    );
    expect(screen.getByText('w')).toBeInTheDocument();
    rerender(
      <PageContainer>
        <div>d</div>
      </PageContainer>,
    );
    expect(screen.getByText('d')).toBeInTheDocument();
    rerender(
      <PageContainer variant="narrow">
        <div>n</div>
      </PageContainer>,
    );
    expect(screen.getByText('n')).toBeInTheDocument();
    rerender(
      <PageContainer className="x">
        <div>x</div>
      </PageContainer>,
    );
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});
