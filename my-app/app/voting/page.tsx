import { FC } from 'react';
import VotingList from '../components/VotingList';

const VotingPage: FC = () => {
  return (
    <div>
      <h1 className='text-black'>Vote on Proposals</h1>
      <VotingList />
    </div>
  );
};

export default VotingPage;
