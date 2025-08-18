import {describe, expect, test} from '@jest/globals';
import {render, screen, act} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import fs from 'node:fs';
import path from 'node:path';
import Demos from './Demos';

describe('demos page', () => {
  test('renders list of demos at index route', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/__demos']}>
          <Routes>
            <Route element={<Demos />} path="/__demos" />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(screen.getByText('Widget Demos')).toBeInTheDocument();
  });

  test('renders a specific demo when :name is provided', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/__demos/Button']}>
          <Routes>
            <Route element={<Demos />} path="/__demos/:name" />
          </Routes>
        </MemoryRouter>,
      );
    });
    expect(screen.getByTestId('ButtonDemo')).toBeInTheDocument();
  });

  test('all demo files are registered in the demos registry', () => {
    const widgetsDir = path.join(__dirname, '../widgets');
    const demoFiles = fs
      .readdirSync(widgetsDir)
      .filter(file => file.endsWith('.demo.tsx'))
      .map(file => file.replace('.demo.tsx', ''));

    // Import the registry from the Demos module
    // We'll need to test this by rendering the component and checking links exist
    render(
      <MemoryRouter initialEntries={['/__demos']}>
        <Routes>
          <Route element={<Demos />} path="/__demos" />
        </Routes>
      </MemoryRouter>,
    );

    // Check that each demo file has a corresponding link in the rendered component
    demoFiles.forEach(demoName => {
      expect(screen.getByRole('link', {name: demoName})).toBeInTheDocument();
    });
  });
});
