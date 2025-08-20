import type {FC} from 'react';
import {Heading} from './Heading.js';
import {Card} from './Card.js';

const HeadingDemo: FC = () => {
  return (
    <div className="space-y-8 p-4">
      <Heading level={1}>Heading Component Demo</Heading>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Heading Levels with Automatic Styling</Heading>
          <div className="space-y-4">
            <Heading level={1}>H1 - Extra Large, Bold (Default Level)</Heading>
            <Heading level={2}>H2 - Large, Bold</Heading>
            <Heading level={3}>H3 - Medium, Bold</Heading>
            <Heading level={4}>H4 - Small, Semibold</Heading>
            <Heading level={5}>H5 - Extra Small, Semibold</Heading>
            <Heading level={6}>H6 - Extra Small, Medium Weight</Heading>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Semantic Hierarchy</Heading>
          <div className="space-y-4">
            <p>
              Headings automatically apply appropriate sizing and weight based
              on their semantic level:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>H1-H3:</strong> Bold weight for primary headings
              </li>
              <li>
                <strong>H4-H5:</strong> Semibold weight for secondary headings
              </li>
              <li>
                <strong>H6:</strong> Medium weight for minor headings
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Parent-Controlled Spacing</Heading>
          <div className="space-y-8">
            <div>
              <Heading level={3}>Headings Don&quot;t Add Spacing</Heading>
              <Heading level={4}>Headings focus only on typography</Heading>
              <p>
                Spacing is controlled by parent elements using utilities like
                space-y, gap, or explicit margins.
              </p>
            </div>

            <div className="space-y-4">
              <Heading level={3}>Parent with space-y-4</Heading>
              <Heading level={4}>Child header</Heading>
              <p>
                This section has space-y-4 applied to the parent div, creating
                consistent spacing between all children.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Common Use Cases</Heading>
          <div className="space-y-8">
            <div>
              <Heading level={2}>Page Section Header</Heading>
              <p>Perfect for main sections of a page or form.</p>
            </div>

            <div>
              <Heading level={3}>Subsection Header</Heading>
              <p>Ideal for breaking up content within a section.</p>
            </div>

            <div>
              <Heading level={5}>Minor Section Header</Heading>
              <p>Great for form field groups or small content areas.</p>
            </div>

            <div>
              <Heading level={4}>Card Title</Heading>
              <p>Perfect for card titles - clean typography only.</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Complex Content</Heading>
          <div className="space-y-4">
            <Heading level={3}>
              Simple <em>text</em> content
            </Heading>
            <Heading level={4}>
              Headings with <strong>nested</strong>{' '}
              <span className="text-blue-600">styled</span> content
            </Heading>
            <Heading level={5}>
              Complex content with{' '}
              <span className="inline-flex items-center">
                multiple <em>elements</em>
              </span>{' '}
              and formatting
            </Heading>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <Heading level={2}>Semantic Typography Hierarchy</Heading>
          <div className="space-y-4">
            <p>
              Headings automatically maintain a proper visual hierarchy based on
              semantic meaning:
            </p>
            <div className="space-y-2">
              <Heading level={1}>H1: Page Title / Hero</Heading>
              <Heading level={2}>H2: Major Section</Heading>
              <Heading level={3}>H3: Subsection</Heading>
              <Heading level={4}>H4: Minor Section</Heading>
              <Heading level={5}>H5: Small Heading</Heading>
              <Heading level={6}>H6: Smallest Heading</Heading>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeadingDemo;
