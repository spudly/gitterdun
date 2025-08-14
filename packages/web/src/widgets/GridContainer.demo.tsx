import {FC} from 'react';
import {GridContainer} from './GridContainer.js';
import {Card} from './Card.js';

const GridContainerDemo: FC = () => {
  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">GridContainer Component</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">2 Columns (Default)</h3>
        <GridContainer cols={2} gap="md">
          <Card>
            <h4 className="font-semibold">Card 1</h4>
            <p>This is the first card in a 2-column grid.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 2</h4>
            <p>This is the second card in a 2-column grid.</p>
          </Card>
        </GridContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">3 Columns</h3>
        <GridContainer cols={3} gap="lg">
          <Card>
            <h4 className="font-semibold">Card 1</h4>
            <p>First card in 3-column grid.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 2</h4>
            <p>Second card in 3-column grid.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 3</h4>
            <p>Third card in 3-column grid.</p>
          </Card>
        </GridContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">4 Columns</h3>
        <GridContainer cols={4} gap="sm">
          <Card>
            <h4 className="font-semibold">Card 1</h4>
            <p>First card.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 2</h4>
            <p>Second card.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 3</h4>
            <p>Third card.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Card 4</h4>
            <p>Fourth card.</p>
          </Card>
        </GridContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Single Column</h3>
        <GridContainer cols={1} gap="xl">
          <Card>
            <h4 className="font-semibold">Single Card</h4>
            <p>This card takes the full width of the container.</p>
          </Card>
        </GridContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Gap Sizes</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Small Gap</h4>
            <GridContainer cols={2} gap="sm">
              <Card>
                <h4 className="font-semibold">Card 1</h4>
                <p>Small gap between cards.</p>
              </Card>
              <Card>
                <h4 className="font-semibold">Card 2</h4>
                <p>Small gap between cards.</p>
              </Card>
            </GridContainer>
          </div>

          <div>
            <h4 className="font-medium mb-2">Large Gap</h4>
            <GridContainer cols={2} gap="lg">
              <Card>
                <h4 className="font-semibold">Card 1</h4>
                <p>Large gap between cards.</p>
              </Card>
              <Card>
                <h4 className="font-semibold">Card 2</h4>
                <p>Large gap between cards.</p>
              </Card>
            </GridContainer>
          </div>

          <div>
            <h4 className="font-medium mb-2">Extra Large Gap</h4>
            <GridContainer cols={2} gap="xl">
              <Card>
                <h4 className="font-semibold">Card 1</h4>
                <p>Extra large gap between cards.</p>
              </Card>
              <Card>
                <h4 className="font-semibold">Card 2</h4>
                <p>Extra large gap between cards.</p>
              </Card>
            </GridContainer>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <GridContainer cols={2} gap="md" className="bg-gray-100 p-4 rounded-lg">
          <Card>
            <h4 className="font-semibold">Custom Card 1</h4>
            <p>Card with custom grid container styling.</p>
          </Card>
          <Card>
            <h4 className="font-semibold">Custom Card 2</h4>
            <p>Card with custom grid container styling.</p>
          </Card>
        </GridContainer>
      </div>
    </div>
  );
};

export default GridContainerDemo;
