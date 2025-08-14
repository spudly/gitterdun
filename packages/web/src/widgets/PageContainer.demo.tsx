import {FC} from 'react';
import {PageContainer} from './PageContainer.js';
import {Card} from './Card.js';

const PageContainerDemo: FC = () => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">PageContainer Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant (Full Width)</h3>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <PageContainer variant="default">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Sample Page
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <PageContainer variant="centered">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Centered Content</h2>
              <p className="text-gray-600 mb-4">
                This variant is perfect for forms, login pages, and focused
                content.
              </p>
              <button
                type="button"
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                Sample Button
              </button>
            </div>
          </PageContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Narrow Variant (Medium Width)</h3>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <PageContainer variant="narrow">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Narrow Layout
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Content Section</h2>
              <p className="text-gray-600 mb-4">
                This variant provides a good balance between full-width and
                centered layouts. It&apos;s ideal for content-heavy pages that
                don&apos;t need the full screen width.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium">Feature 1</h3>
                  <p className="text-sm text-gray-600">
                    Description of feature 1
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
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
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <PageContainer
            variant="default"
            className="bg-gradient-to-br from-blue-50 to-indigo-100"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Custom Background
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
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
