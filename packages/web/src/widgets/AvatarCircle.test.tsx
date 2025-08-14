import {render, screen} from '@testing-library/react';
import {AvatarCircle} from './AvatarCircle';

describe('AvatarCircle', () => {
  it('renders initials and supports emoji/ring/size', () => {
    const {rerender} = render(<AvatarCircle label="John Doe" />);
    expect(screen.getByLabelText('John Doe')).toBeInTheDocument();
    rerender(<AvatarCircle label="Jane" emoji="🙂" ring size="lg" />);
    expect(screen.getByLabelText('Jane')).toBeInTheDocument();
  });
});
