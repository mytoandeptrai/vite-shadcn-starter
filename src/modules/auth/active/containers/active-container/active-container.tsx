import LoadingSpinner from '@/components/shared/loading-spinner';
import { useActiveContainer } from '../../hooks';

type ActiveContainerProps = {
  token?: string;
};

const ActiveContainer = (props: ActiveContainerProps) => {
  useActiveContainer(props);
  return <LoadingSpinner />;
};

export default ActiveContainer;
