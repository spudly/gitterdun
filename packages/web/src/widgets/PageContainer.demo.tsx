import type {FC} from 'react';
import {PageContainer} from './PageContainer.js';
import {Card} from './Card.js';

const PageContainerDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">PageContainer Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant (Full Width)</h3>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
          <PageContainer variant="default">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              Sample Page
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <h3 className="font-semibold">Card 1</h3>

                <p>This is a sample card content.</p>
              </Card>

              <Card>
                <h3 className="font-semibold">Card 2</h3>

                <p>This is another sample card.</p>
              </Card>

              <Card>
                <h3 className="font-semibold">Card 3</h3>

                <p>And one more card for the grid.</p>
              </Card>
            </div>
          </PageContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Centered Variant (Narrow Width)
        </h3>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
          <PageContainer variant="centered">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-semibold">Centered Content</h2>

              <p className="mb-4 text-gray-600">
                This variant is perfect for forms, login pages, and focused
                content.
              </p>

              <button
                className="w-full rounded bg-indigo-600 py-2 text-white"
                type="button"
              >
                Sample Button
              </button>
            </div>
          </PageContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Narrow Variant (Medium Width)</h3>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
          <PageContainer variant="narrow">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              Narrow Layout
            </h1>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Content Section</h2>

              <p className="mb-4 text-gray-600">
                This variant provides a good balance between full-width and
                centered layouts. It&apos;s ideal for content-heavy pages that
                don&apos;t need the full screen width.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded bg-gray-50 p-4">
                  <h3 className="font-medium">Feature 1</h3>

                  <p className="text-sm text-gray-600">
                    Description of feature 1
                  </p>
                </div>

                <div className="rounded bg-gray-50 p-4">
                  <h3 className="font-medium">Feature 2</h3>

                  <p className="text-sm text-gray-600">
                    Description of feature 2
                  </p>
                </div>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
          <PageContainer gradient="indigo" variant="default">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
              Custom Background
            </h1>

            <div className="rounded-lg bg-white/80 p-6 shadow backdrop-blur-sm">
              <p className="text-gray-700">
                This page container has custom background styling applied while
                maintaining the base layout structure.
              </p>
            </div>
          </PageContainer>
        </div>
      </div>
    </div>
  );
};

export default PageContainerDemo;
