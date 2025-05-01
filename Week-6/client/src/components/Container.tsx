import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex-1 w-full p-8 overflow-auto flex flex-col">
      {children}
    </div>
  );
};

export default Container;
