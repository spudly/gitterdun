import {render, screen} from '@testing-library/react';
import {FormCard} from './FormCard';

describe('FormCard', () => {
  it('renders title and children', () => {
    render(
      <FormCard title="T">
        <div>child</div>
      </FormCard>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
