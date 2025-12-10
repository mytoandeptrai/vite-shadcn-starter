import { useActiveContainer } from '../../hooks';

type ActiveContainerProps = {
  email?: string;
  code?: number;
  to?: string;
};

const ActiveContainer = (props: ActiveContainerProps) => {
  useActiveContainer(props);
  return null;
};

export default ActiveContainer;
