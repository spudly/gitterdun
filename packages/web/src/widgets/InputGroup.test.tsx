import {render, screen} from '@testing-library/react';
import {InputGroup} from './InputGroup';

describe('InputGroup', () => {
  it('renders help and error', () => {
    render(
      <InputGroup error="E"
helpText="H"
      >
        <input />
      </InputGroup>,
    );
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('supports horizontal layout', () => {
    const {container} = render(
      <InputGroup layout="horizontal">
        <input />
      </InputGroup>,
    );
    expect(container.firstChild).toHaveClass('flex');
  });
});
