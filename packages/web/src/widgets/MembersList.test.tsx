import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MembersList} from './MembersList';

describe('membersList', () => {
  test('renders items', () => {
    render(
      <MembersList
        members={[{user_id: 1, username: 'U', email: 'e@x', role: 'parent'}]}
      />,
    );
    expect(screen.getByText(/U/u)).toBeInTheDocument();
    expect(screen.getByText(/parent/u)).toBeInTheDocument();
  });
});
