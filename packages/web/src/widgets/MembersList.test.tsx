import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MembersList} from './MembersList';
import {createWrapper} from '../test/createWrapper';

describe('membersList', () => {
  test('renders items', () => {
    const Wrapper = createWrapper({i18n: true});
    render(
      <MembersList
        members={[{user_id: 1, username: 'U', email: 'e@x', role: 'parent'}]}
      />,
      {wrapper: Wrapper},
    );
    expect(screen.getByText(/U/u)).toBeInTheDocument();
    expect(screen.getByText(/parent/u)).toBeInTheDocument();
  });
});
