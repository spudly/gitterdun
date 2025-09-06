import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {Routes, Route} from 'react-router-dom';
import fs from 'node:fs';
import path from 'node:path';
import {z} from 'zod';
import Demos from './Demos.js';
import {createWrapper} from '../test/createWrapper.js';

// Test the local DemoParamsSchema
const DemoParamsSchema = z.object({name: z.string().min(1).optional()});

describe('demoParamsSchema', () => {
  test('should validate valid demo name', () => {
    const validParams = {name: 'Button'};
    const result = DemoParamsSchema.safeParse(validParams);
    expect(result.success).toBe(true);
  });

  test('should validate when name is undefined', () => {
    const validParams = {};
    const result = DemoParamsSchema.safeParse(validParams);
    expect(result.success).toBe(true);
  });

  test('should reject empty string name', () => {
    const invalidParams = {name: ''};
    const result = DemoParamsSchema.safeParse(invalidParams);
    expect(result.success).toBe(false);
  });
});

describe('demos page', () => {
  test('renders list of demos at index route', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/__demos']},
    });
    render(
      <Routes>
        <Route element={<Demos />} path="/__demos" />
      </Routes>,
      {wrapper: Wrapper},
    );
    await expect(
      screen.findByText('Widget Demos'),
    ).resolves.toBeInTheDocument();
  });

  test('renders a specific demo when :name is provided', async () => {
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/__demos/Button']},
    });
    render(
      <Routes>
        <Route element={<Demos />} path="/__demos/:name" />
      </Routes>,
      {wrapper: Wrapper},
    );
    await expect(
      screen.findByTestId('ButtonDemo'),
    ).resolves.toBeInTheDocument();
  });

  test('all demo files are registered in the demos registry', () => {
    const widgetsDir = path.join(__dirname, '../widgets');
    const demoFiles = fs
      .readdirSync(widgetsDir)
      .filter(file => file.endsWith('.demo.tsx'))
      .map(file => file.replace('.demo.tsx', ''));

    // Import the registry from the Demos module
    // We'll need to test this by rendering the component and checking links exist
    const Wrapper = createWrapper({
      i18n: true,
      router: {initialEntries: ['/__demos']},
    });
    render(
      <Routes>
        <Route element={<Demos />} path="/__demos" />
      </Routes>,
      {wrapper: Wrapper},
    );

    // Check that each demo file has a corresponding link in the rendered component
    demoFiles.forEach(demoName => {
      expect(screen.getByRole('link', {name: demoName})).toHaveAttribute(
        'href',
        expect.stringContaining(demoName),
      );
    });
  });
});
