import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import type {RankingItem} from './RankingList';
import {RankingList} from './RankingList';
import type {PodiumItem} from './Podium';
import {Podium} from './Podium';
import {createWrapper} from '../test/createWrapper';

describe('rankingList & Podium', () => {
  test('renders ranking list with/without rank', () => {
    const items: Array<RankingItem> = [
      {
        id: 1,
        rank: 1,
        content: <span>A</span>,
        score: '10',
        subtitle: <span>sub</span>,
        metadata: <span>meta</span>,
      },
    ];
    const {rerender} = render(
      <RankingList items={items} subtitle="S" title="T" />,
    );
    expect(screen.getByText('T')).toHaveTextContent('T');
    expect(screen.getByText('S')).toHaveTextContent('S');
    expect(screen.getByText('A')).toHaveTextContent('A');
    rerender(<RankingList items={items} showRank={false} />);
    expect(screen.getByText('A')).toHaveTextContent('A');
  });

  test('renders podium medals and raw ranks', () => {
    const items: Array<PodiumItem> = [
      {id: 1, rank: 1, content: <span>A</span>, score: 5, subtitle: 's'},
      {id: 2, rank: 2, content: <span>B</span>},
      {id: 3, rank: 3, content: <span>C</span>},
    ];
    const Wrapper = createWrapper({i18n: true});
    const {rerender} = render(<Podium items={items} />, {wrapper: Wrapper});
    expect(screen.getByText('A')).toHaveTextContent('A');
    rerender(<Podium items={items} showMedals={false} />);
    expect(screen.getByText('A')).toHaveTextContent('A');
  });
});
