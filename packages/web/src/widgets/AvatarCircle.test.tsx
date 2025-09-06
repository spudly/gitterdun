import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {AvatarCircle} from './AvatarCircle.js';

describe('avatarCircle', () => {
  test('renders initials and supports emoji/ring/size', () => {
    const {rerender} = render(<AvatarCircle label="John Doe" />);
    expect(screen.getByLabelText('John Doe')).toHaveAccessibleName('John Doe');
    rerender(<AvatarCircle emoji="🙂" label="Jane" ring size="lg" />);
    expect(screen.getByLabelText('Jane')).toHaveAccessibleName('Jane');
  });
});
