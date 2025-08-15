import type {FC} from 'react';
import {Card} from './Card.js';

const CardDemo: FC = () => {
  return (
    <div className="space-y-4"
data-testid="CardDemo"
    >
      <Card>Simple card</Card>

      <Card header={<div>Header</div>}>With header</Card>

      <Card footer={<div>Footer</div>}>With footer</Card>

      <Card elevated={false}>Bordered (flat)</Card>

      <Card padded={false}>No Padding</Card>
    </div>
  );
};

export default CardDemo;
