import {
  ChakraInput,
  Box,
  Heading,
  Flex,
  Text,
} from "@raidguild/design-system";
import {
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
} from "@chakra-ui/react";
import _ from "lodash";
import actions from "../state/actions";

interface CalculatorFormProps {
  state: any;
  dispatch: any;
}

const columns = {
  hours: {
    title: "Hours",
  },
  hourly: {
    title: "Hourly",
  },
  min_timeline: {
    title: "Min Weeks",
  },
  max_timeline: {
    title: "Max Weeks",
  },
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  state,
  dispatch,
  ...props
}) => (
  <Box w="80%" mt="70px" mx="auto">
    <Heading py="20px">Cleric Calculator</Heading>
    <Accordion defaultIndex={[0]} allowMultiple>
      {_.map(_.keys(state.options), (group) => (
        <AccordionItem key={group}>
          <Heading size="lg">
            <AccordionButton
              as={Flex}
              justify="space-between"
              _hover={{ cursor: "pointer" }}
            >
              <Heading size="sm" w="40%">
                {_.capitalize(group)}
              </Heading>
              <Flex w="50%" justify="space-between">
                {_.map(columns, (c) => (
                  <Text as={Box} w="20%">
                    {c.title}
                  </Text>
                ))}
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            {_.map(_.keys(state.options[group]), (option: string) => {
              const currentOption = state.options[group][option];
              return (
                <Flex align="center" gap={3} my={2} key={option}>
                  <Checkbox
                    size="lg"
                    isChecked={currentOption.active}
                    onChange={() =>
                      dispatch({
                        type: actions.TOGGLE_OPTION,
                        group,
                        option,
                      })
                    }
                  />
                  <Box w="40%">
                    <Text size="lg">{_.capitalize(currentOption.title)}</Text>
                  </Box>
                  <Flex w="50%" justify="space-between">
                    {_.map(_.keys(columns), (key) => (
                      <Flex w="20%" align="center">
                        {key === "hourly" && <Heading pr={3}>$</Heading>}
                        <ChakraInput
                          type="number"
                          placeholder="Hours"
                          value={currentOption[key]}
                          isDisabled={!currentOption.active}
                        />
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              );
            })}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);

export default CalculatorForm;
