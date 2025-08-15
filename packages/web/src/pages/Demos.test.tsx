import {render, screen, act} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Demos from './Demos';

describe('Demos page', () => {
  it('renders list of demos at index route', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/__demos']}>
          <Routes>
            <Route element={<Demos />}
path="/__demos"
            />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(screen.getByText('Widget Demos')).toBeInTheDocument();
  });

  it('renders a specific demo when :name is provided', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/__demos/Button']}>
          <Routes>
            <Route element={<Demos />}
path="/__demos/:name"
            />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(screen.getByTestId('ButtonDemo')).toBeInTheDocument();
  });
});
