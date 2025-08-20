import type {FC} from 'react';
import {GridContainer} from './GridContainer.js';
import {Card} from './Card.js';
import {Heading} from './Heading.js';
const GridContainerDemo: FC = () => {
  return (
    <div className="space-y-8 p-4">
      <Heading level={2}>GridContainer Component</Heading>
      <div className="space-y-4">
        <Heading level={3}>2 Columns (Default)</Heading>
        <GridContainer cols={2} gap="md">
          <Card>
            <Heading level={4}>Card 1</Heading>
            <p>This is the first card in a 2-column grid.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 2</Heading>
            <p>This is the second card in a 2-column grid.</p>
          </Card>
        </GridContainer>
      </div>
      <div className="space-y-4">
        <Heading level={3}>3 Columns</Heading>
        <GridContainer cols={3} gap="lg">
          <Card>
            <Heading level={4}>Card 1</Heading>
            <p>First card in 3-column grid.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 2</Heading>
            <p>Second card in 3-column grid.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 3</Heading>
            <p>Third card in 3-column grid.</p>
          </Card>
        </GridContainer>
      </div>
      <div className="space-y-4">
        <Heading level={3}>4 Columns</Heading>
        <GridContainer cols={4} gap="sm">
          <Card>
            <Heading level={4}>Card 1</Heading>
            <p>First card.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 2</Heading>
            <p>Second card.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 3</Heading>
            <p>Third card.</p>
          </Card>
          <Card>
            <Heading level={4}>Card 4</Heading>
            <p>Fourth card.</p>
          </Card>
        </GridContainer>
      </div>
      <div className="space-y-4">
        <Heading level={3}>Single Column</Heading>
        <GridContainer cols={1} gap="xl">
          <Card>
            <Heading level={4}>Single Card</Heading>
            <p>This card takes the full width of the container.</p>
          </Card>
        </GridContainer>
      </div>
      <div className="space-y-4">
        <Heading level={3}>Different Gap Sizes</Heading>
        <div className="space-y-6">
          <div>
            <Heading level={5}>Small Gap</Heading>
            <GridContainer cols={2} gap="sm">
              <Card>
                <Heading level={4}>Card 1</Heading>
                <p>Small gap between cards.</p>
              </Card>
              <Card>
                <Heading level={4}>Card 2</Heading>
                <p>Small gap between cards.</p>
              </Card>
            </GridContainer>
          </div>
          <div>
            <Heading level={5}>Large Gap</Heading>
            <GridContainer cols={2} gap="lg">
              <Card>
                <Heading level={4}>Card 1</Heading>
                <p>Large gap between cards.</p>
              </Card>
              <Card>
                <Heading level={4}>Card 2</Heading>
                <p>Large gap between cards.</p>
              </Card>
            </GridContainer>
          </div>
          <div>
            <Heading level={5}>Extra Large Gap</Heading>
            <GridContainer cols={2} gap="xl">
              <Card>
                <Heading level={4}>Card 1</Heading>
                <p>Extra large gap between cards.</p>
              </Card>
              <Card>
                <Heading level={4}>Card 2</Heading>
                <p>Extra large gap between cards.</p>
              </Card>
            </GridContainer>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Heading level={3}>Custom Styling</Heading>
        <Card elevated padded>
          <GridContainer cols={2} gap="md">
            <Card>
              <Heading level={4}>Custom Card 1</Heading>
              <p>Card inside a wrapped container.</p>
            </Card>
            <Card>
              <Heading level={4}>Custom Card 2</Heading>
              <p>Card inside a wrapped container.</p>
            </Card>
          </GridContainer>
        </Card>
      </div>
    </div>
  );
};
export default GridContainerDemo;
