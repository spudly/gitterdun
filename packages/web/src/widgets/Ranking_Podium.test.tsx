import {render, screen} from '@testing-library/react';
import {RankingList, RankingItem} from './RankingList';
import {Podium, PodiumItem} from './Podium';

describe('RankingList & Podium', () => {
  it('renders ranking list with/without rank', () => {
    const items: RankingItem[] = [
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
      <RankingList items={items} title="T" subtitle="S" />,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    rerender(<RankingList items={items} showRank={false} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders podium medals and raw ranks', () => {
    const items: PodiumItem[] = [
      {id: 1, rank: 1, content: <span>A</span>, score: 5, subtitle: 's'},
      {id: 2, rank: 2, content: <span>B</span>},
      {id: 3, rank: 3, content: <span>C</span>},
    ];
    const {rerender} = render(<Podium items={items} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    rerender(<Podium items={items} showMedals={false} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
