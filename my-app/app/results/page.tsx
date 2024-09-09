import { FC } from 'react';
import ResultsDisplay from '../components/ResultDisplay';

const ResultsPage: FC = () => {
  // Replace with actual proposal ID or logic to fetch it
  const proposalId = '9qkB1pcntVosURAYkTzKznGM2KuGJR5A2PmXZyBrWir1s';

  return (
    <div>
      {/* <h1>View Results</h1> */}
      <ResultsDisplay proposalId={proposalId} />
    </div>
  );
};

export default ResultsPage;
