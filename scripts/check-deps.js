#!/usr/bin/env node

const {execSync} = require('child_process');
const path = require('path');

const packages = ['packages/web', 'packages/api', 'packages/shared'];
const configPath = path.join(process.cwd(), '.depcheckrc.json');

// Known build tools and dev dependencies that are commonly flagged but are needed
const knownBuildDeps = new Set([
  '@jest/globals',
  'jest',
  'jest-environment-jsdom',
  'ts-jest',
  '@babel/plugin-transform-react-jsx',
  '@testing-library/dom',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@vitejs/plugin-react',
  'vite',
  'autoprefixer',
  'postcss',
  'tailwindcss',
  '@tailwindcss/postcss',
  'typescript',
  'nodemon',
  'tsx',
  'pino-pretty',
  '@types/react',
  '@types/react-dom',
  '@types/cookie-parser',
  '@types/node',
]);

let hasErrors = false;

for (const pkg of packages) {
  console.log(`\n🔍 Checking dependencies for ${pkg}...`);

  try {
    let result;
    try {
      result = execSync(`npx depcheck ${pkg} --config ${configPath} --json`, {
        encoding: 'utf8',
      });
    } catch (execError) {
      // Depcheck might exit with error due to parser issues, but still output valid JSON
      result = execError.stdout || '';
    }

    if (!result) {
      throw new Error('No output from depcheck');
    }

    const data = JSON.parse(result);

    // Filter out known build dependencies from unused dependencies
    const actualUnusedDeps = data.dependencies.filter(
      dep => !knownBuildDeps.has(dep),
    );
    const actualUnusedDevDeps = data.devDependencies.filter(
      dep => !knownBuildDeps.has(dep),
    );

    // Only report if there are actual issues
    if (
      actualUnusedDeps.length > 0
      || actualUnusedDevDeps.length > 0
      || Object.keys(data.missing).length > 0
    ) {
      hasErrors = true;

      if (actualUnusedDeps.length > 0) {
        console.log(`❌ Unused dependencies in ${pkg}:`);
        actualUnusedDeps.forEach(dep => console.log(`  • ${dep}`));
      }

      if (actualUnusedDevDeps.length > 0) {
        console.log(`⚠️  Unused devDependencies in ${pkg}:`);
        actualUnusedDevDeps.forEach(dep => console.log(`  • ${dep}`));
      }

      if (Object.keys(data.missing).length > 0) {
        console.log(`❌ Missing dependencies in ${pkg}:`);
        Object.entries(data.missing).forEach(([dep, files]) => {
          console.log(`  • ${dep} (used in ${files.length} files)`);
        });
      }
    } else {
      console.log(`✅ No dependency issues found in ${pkg}`);
    }

    // Report any parsing errors for transparency but don't fail the build
    const invalidFileCount = Object.keys(data.invalidFiles).length;
    if (invalidFileCount > 0) {
      console.log(
        `ℹ️  Note: ${invalidFileCount} files could not be parsed (this is usually fine)`,
      );
    }
  } catch (error) {
    console.error(`❌ Error checking ${pkg}:`);
    // Don't show the full error output as it's mostly parser warnings
    console.error('Failed to run depcheck command');
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log('\n❌ Dependency issues found. Please review the output above.');
  process.exit(1);
} else {
  console.log('\n✅ All packages have clean dependencies!');
}
