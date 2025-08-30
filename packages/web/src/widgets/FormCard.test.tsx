import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {FormCard} from './FormCard';

describe('formCard', () => {
  test('renders title and children', () => {
    render(
      <FormCard title="T">
        <div>child</div>
      </FormCard>,
    );
    expect(screen.getByText('T')).toHaveTextContent('T');
    expect(screen.getByText('child')).toHaveTextContent('child');
  });
});
