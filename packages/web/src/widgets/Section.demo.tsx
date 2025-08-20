/* eslint-disable max-lines -- just a demo */

import type {FC} from 'react';
import {Section} from './Section.js';
import {Card} from './Card.js';

const SectionDemo: FC = () => {
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-4xl font-bold">Section Component Demo</h1>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Basic Section Usage</h2>
          <Section header="Simple Section">
            <p>
              This is a basic section with a header and some content. The header
              automatically uses level 2 as the default.
            </p>
            <p>Multiple paragraphs are supported as children.</p>
          </Section>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Custom Header Levels</h2>
          <div className="space-y-4">
            <Section header="Level 1 Section" headingLevel={1}>
              <p>This section explicitly uses header level 1.</p>
            </Section>

            <Section header="Level 3 Section" headingLevel={3}>
              <p>This section explicitly uses header level 3.</p>
            </Section>

            <Section header="Level 6 Section" headingLevel={6}>
              <p>This section explicitly uses header level 6.</p>
            </Section>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Gap Spacing Options</h2>

          <div className="space-y-6">
            <Section gap="xs" header="Extra Small Gap (xs)">
              <p>Very tight spacing between header and content.</p>
              <p>Good for compact layouts.</p>
              <div>Multiple elements with minimal gap.</div>
            </Section>

            <Section gap="sm" header="Small Gap (sm)">
              <p>Small spacing between elements.</p>
              <p>Useful for related content.</p>
            </Section>

            <Section gap="md" header="Medium Gap (md)">
              <p>Standard spacing between elements.</p>
              <p>Good default for most sections.</p>
            </Section>

            <Section gap="lg" header="Large Gap (lg)">
              <p>Generous spacing between elements.</p>
              <p>Creates clear visual separation.</p>
            </Section>

            <Section gap="xl" header="Extra Large Gap (xl)">
              <p>Maximum spacing between elements.</p>
              <p>For sections that need strong visual separation.</p>
            </Section>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Automatic Nested Level Management
          </h2>
          <Section header="Article Title">
            <p>
              This is the main article content. Notice how nested sections
              automatically increment their header levels.
            </p>

            <Section header="Chapter 1">
              <p>
                This chapter header is automatically level 3, one level deeper
                than its parent.
              </p>

              <Section header="Section 1.1">
                <p>This section header is automatically level 4.</p>

                <Section header="Subsection 1.1.1">
                  <p>
                    This subsection header is automatically level 5. The context
                    handles the nesting automatically!
                  </p>

                  <Section header="Sub-subsection 1.1.1.1">
                    <p>This is level 6, the maximum heading level.</p>

                    <Section header="Deeply Nested Section">
                      <p>
                        This section is capped at level 6 since HTML headings
                        only go up to h6.
                      </p>

                      <Section header="Even Deeper">
                        <p>
                          Still level 6 - the context prevents invalid levels.
                        </p>
                      </Section>
                    </Section>
                  </Section>
                </Section>
              </Section>

              <Section header="Section 1.2">
                <p>Back to level 4 for this sibling section.</p>
              </Section>
            </Section>

            <Section header="Chapter 2">
              <p>Another level 3 chapter.</p>
            </Section>
          </Section>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Overriding Context Levels</h2>
          <Section header="Parent Section (Level 2)">
            <p>This parent uses the default level 2.</p>

            <Section header="Normal Child (Level 3)">
              <p>This child follows the context and uses level 3.</p>

              <Section header="Override to Level 1" headingLevel={1}>
                <p>
                  This section overrides the context to use level 1, breaking
                  the automatic hierarchy when needed.
                </p>

                <Section header="Context Resumes (Level 2)">
                  <p>
                    This section starts a new context from level 1, so it
                    becomes level 2.
                  </p>

                  <Section header="Back to Normal (Level 3)">
                    <p>Context continues normally from here.</p>
                  </Section>
                </Section>
              </Section>
            </Section>
          </Section>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Mixed Content Example</h2>
          <Section gap="md" header="Documentation Page">
            <p>
              This demonstrates how sections work with mixed content types,
              maintaining proper semantic structure.
            </p>

            <ul className="list-disc space-y-1 pl-6">
              <li>Sections can contain any type of content</li>
              <li>Lists, paragraphs, divs, other components</li>
              <li>The semantic structure is preserved</li>
            </ul>

            <Section gap="sm" header="Getting Started">
              <p>Installation instructions and basic setup.</p>

              <code className="block rounded bg-gray-100 p-2">
                npm install section-widget
              </code>

              <Section header="Basic Usage">
                <p>Here is how to use the basic features.</p>
              </Section>

              <Section header="Advanced Features">
                <p>More complex usage patterns and customization.</p>

                <Section header="Context Management">
                  <p>Understanding automatic header level management.</p>
                </Section>
              </Section>
            </Section>

            <Section gap="lg" header="API Reference">
              <p>Complete API documentation with examples.</p>

              <Section header="Props">
                <ul className="list-disc pl-6">
                  <li>
                    <strong>header</strong>: Section title (required)
                  </li>
                  <li>
                    <strong>headingLevel</strong>: Override automatic level
                  </li>
                  <li>
                    <strong>gap</strong>: Spacing between elements
                  </li>
                </ul>
              </Section>

              <Section header="Context">
                <p>
                  Information about SectionContext and automatic level
                  management.
                </p>
              </Section>
            </Section>
          </Section>
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Real-World Example: Blog Post</h2>
          <Section
            gap="md"
            header="Understanding React Contexts"
            headingLevel={1}
          >
            <p>
              <em>Published on March 15, 2024 by Jane Developer</em>
            </p>

            <p>
              React Context is a powerful feature that allows you to share data
              between components without prop drilling. In this article,
              we&apos;ll explore how to create and use contexts effectively.
            </p>

            <Section gap="sm" header="What is React Context?">
              <p>
                React Context provides a way to pass data through the component
                tree without having to pass props down manually at every level.
              </p>

              <Section header="When to Use Context">
                <p>
                  Context is ideal for data that can be considered
                  &quot;global&quot; for a tree of React components.
                </p>

                <ul className="list-disc pl-6">
                  <li>Current authenticated user</li>
                  <li>Theme preferences</li>
                  <li>Preferred language</li>
                </ul>
              </Section>

              <Section header="When NOT to Use Context">
                <p>
                  Avoid overusing context. If you only need to avoid passing
                  props a few levels down, component composition might be a
                  simpler solution.
                </p>
              </Section>
            </Section>

            <Section gap="sm" header="Creating a Context">
              <p>
                Here&apos;s how to create and provide a context in your React
                application.
              </p>

              <Section header="Basic Context Setup">
                <code className="block rounded bg-gray-100 p-4 text-sm">
                  {`const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}`}
                </code>
              </Section>

              <Section header="Using the Context">
                <p>
                  Consume the context in child components using the useContext
                  hook.
                </p>
              </Section>
            </Section>

            <Section gap="md" header="Best Practices">
              <p>Follow these guidelines for effective context usage.</p>

              <Section header="Keep Contexts Focused">
                <p>
                  Each context should have a single responsibility. Don&apos;t
                  create mega-contexts that handle everything.
                </p>
              </Section>

              <Section header="Provide Default Values">
                <p>
                  Always provide sensible default values for your contexts to
                  prevent runtime errors.
                </p>
              </Section>

              <Section header="Use Custom Hooks">
                <p>
                  Create custom hooks that encapsulate context usage and provide
                  better developer experience.
                </p>
              </Section>
            </Section>

            <Section header="Conclusion">
              <p>
                React Context is a powerful pattern when used appropriately. It
                helps eliminate prop drilling while maintaining clean, readable
                code. Remember to use it judiciously and always consider simpler
                alternatives first.
              </p>
            </Section>
          </Section>
        </div>
      </Card>
    </div>
  );
};

export default SectionDemo;
/* eslint-enable max-lines */
