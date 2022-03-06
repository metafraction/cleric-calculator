import { ChakraInput } from "@raidguild/design-system";

const Pledge: React.FC = ({}) => {
  return (
    <div>
      <div>
        <ChakraInput type="number" placeholder="Amount (DAI)" />
      </div>
      <div>
        <ChakraInput type="number" placeholder="Amount (DAI)" />
      </div>
    </div>
  );
};
export default Pledge;
