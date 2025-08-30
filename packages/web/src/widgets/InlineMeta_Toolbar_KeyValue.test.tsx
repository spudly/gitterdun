import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {InlineMeta} from './InlineMeta';
import {Toolbar} from './Toolbar';
import {KeyValue} from './KeyValue';

describe('inlineMeta/Toolbar/KeyValue', () => {
  test('renders content', () => {
    render(
      <div>
        <InlineMeta>
          <span>A</span>
        </InlineMeta>

        <Toolbar>
          <button type="button">B</button>
        </Toolbar>

        <KeyValue label="K" value="V" />
      </div>,
    );
    expect(screen.getByText('A')).toHaveTextContent('A');
    expect(screen.getByText('B')).toHaveTextContent('B');
    expect(screen.getByText('K')).toHaveTextContent('K');
    expect(screen.getByText('V')).toHaveTextContent('V');
  });
});
