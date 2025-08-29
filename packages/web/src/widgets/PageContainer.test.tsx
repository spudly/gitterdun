import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {PageContainer} from './PageContainer';

describe('pageContainer', () => {
  test('renders variants', () => {
    const {rerender} = render(
      <PageContainer variant="centered">
        <div>c</div>
      </PageContainer>,
    );
    expect(screen.getByText('c')).toHaveTextContent('c');
    rerender(
      <PageContainer variant="wide">
        <div>w</div>
      </PageContainer>,
    );
    expect(screen.getByText('w')).toHaveTextContent('w');
    rerender(
      <PageContainer>
        <div>d</div>
      </PageContainer>,
    );
    expect(screen.getByText('d')).toHaveTextContent('d');
    rerender(
      <PageContainer variant="narrow">
        <div>n</div>
      </PageContainer>,
    );
    expect(screen.getByText('n')).toHaveTextContent('n');
    rerender(
      <PageContainer>
        <div>x</div>
      </PageContainer>,
    );
    expect(screen.getByText('x')).toHaveTextContent('x');
  });
});
