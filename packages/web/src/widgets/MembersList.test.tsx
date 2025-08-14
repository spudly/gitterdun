import {render, screen} from '@testing-library/react';
import {MembersList} from './MembersList';

describe('MembersList', () => {
  it('renders items', () => {
    render(
      <MembersList
        members={[{user_id: 1, username: 'U', email: 'e@x', role: 'parent'}]}
      />,
    );
    expect(screen.getByText(/U/)).toBeInTheDocument();
    expect(screen.getByText(/parent/)).toBeInTheDocument();
  });
});
