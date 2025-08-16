import {render, screen} from '@testing-library/react';
import {InlineMeta} from './InlineMeta';
import {Toolbar} from './Toolbar';
import {KeyValue} from './KeyValue';

describe('InlineMeta/Toolbar/KeyValue', () => {
  it('renders content', () => {
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
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
  });
});
