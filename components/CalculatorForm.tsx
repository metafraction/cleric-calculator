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
import { commify } from "ethers/lib/utils";
import actions from "../state/actions";
import { specificationOptions } from "../utils/constants";

interface CalculatorFormProps {
  state: any;
  dispatch: any;
}

const columns: {
  [key: string]: {
    title: string;
    width: string;
  };
} = {
  hours: {
    title: "Hours",
    width: "20%",
  },
  hourly: {
    title: "Hourly",
    width: "20%",
  },
  total: {
    title: "Total",
    width: "20%",
  },
  min_timeline: {
    title: "Min Weeks",
    width: "15%",
  },
  max_timeline: {
    title: "Max Weeks",
    width: "15%",
  },
};

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  state,
  dispatch,
  ...props
}) => {
  const columnSubTotalForGroup = (group: string, column: string) => {
    const activeOptions = _.filter(state.options[group], ["active", true]);
    if (column === "hourly") {
      return _.size(activeOptions) > 0
        ? _.meanBy(activeOptions, column).toFixed(2)
        : 0;
    }
    if (column === "total") {
      return commify(_.sum(_.map(activeOptions, (o) => o.hours * o.hourly)));
    }

    return _.sumBy(activeOptions, column) || 0;
  };

  const groupSubtotals = (group: string) => (
    <Flex w="50%" justify="space-between">
      {_.map(_.keys(columns), (column) => (
        <Flex justify="center" align="center" w={columns[column].width}>
          <Heading size="sm">
            {(column === "hourly" || column === "total") && "$"}
            {columnSubTotalForGroup(group, column) || 0}
          </Heading>
        </Flex>
      ))}
    </Flex>
  );

  const totalsRow = () => {
    const flatOptions = {
      ...state.options.specification,
      ...state.options.content,
      ...state.options.design,
      ...state.options.development,
    };
    const allActiveOptions = _.filter(flatOptions, ["active", true]);
    const totalSum = _.multiply(
      _.sum(_.map(allActiveOptions, (o: any) => o.hours * o.hourly)),
      1.3 // TODO this is pretty rudimentary for cleric/guild/pm calc
    );

    const totalValue = (column: string) => {
      if (column === "total") return totalSum;
      if (column === "hourly") return _.meanBy(allActiveOptions, "hourly");
      return _.sumBy(allActiveOptions, column);
    };

    // TODO update the maths below here for PM/Cleric/Spoils
    return (
      <Flex direction="column" w="50%" h="200px" justify="space-around">
        <Flex justify="center">
          <Heading size="sm">
            Project Manager {"=>"} 10% (${commify(totalValue("total") * 0.1)})
          </Heading>
        </Flex>
        <Flex justify="center">
          <Heading size="sm">
            Cleric {"=>"} 10% (${commify(totalValue("total") * 0.1)})
          </Heading>
        </Flex>
        <Flex justify="center">
          <Heading size="sm">
            Guild Spoils {"=>"} 10% (${commify(totalValue("total") * 0.1)})
          </Heading>
        </Flex>

        <Flex borderTop="1px" borderTopColor="whiteAlpha.400">
          {_.map(_.keys(columns), (column) => (
            <Flex justify="center" align="center" w={columns[column].width}>
              <Heading size="sm">
                {(column === "hourly" || column === "total") && "$"}
                {column === "total"
                  ? commify(totalValue(column))
                  : totalValue(column) || 0}
              </Heading>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  };

  return (
    <Box w="80%" mt="70px" mx="auto">
      <Heading py="20px">Cleric Calculator</Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {_.map(_.keys(state.options), (group) => {
          return (
            <AccordionItem key={group}>
              {({ isExpanded }) => (
                <>
                  <Heading size="lg">
                    <AccordionButton
                      as={Flex}
                      _hover={{ cursor: "pointer" }}
                      align="center"
                      w="100%"
                    >
                      <Heading size="sm" w="40%">
                        {_.capitalize(group)}
                      </Heading>
                      {isExpanded ? (
                        <Flex w="50%" justify="space-between">
                          {_.map(columns, (c) => (
                            <Flex w={c.width}>
                              <Heading as={Box} size="sm" key={c.title}>
                                {c.title}
                              </Heading>
                            </Flex>
                          ))}
                        </Flex>
                      ) : (
                        groupSubtotals(group)
                      )}

                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>

                  <AccordionPanel pb={4}>
                    {_.map(_.keys(state.options[group]), (option: string) => {
                      const currentOption = state.options[group][option];
                      return (
                        <Flex align="center" gap={3} my={2} key={option}>
                          <Box w="40%">
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
                            >
                              <Text size="lg">
                                {_.capitalize(currentOption.title)}
                              </Text>
                            </Checkbox>
                          </Box>
                          <Flex w="50%" justify="space-between">
                            {_.map(_.keys(columns), (key: string) => (
                              <Flex
                                w={columns[key].width}
                                align="center"
                                key={key}
                              >
                                {key === "hourly" && (
                                  <Heading pr={3}>$</Heading>
                                )}
                                {key === "total" ? (
                                  <Text as={Box} size="2xl" mx="auto">
                                    $
                                    {commify(
                                      currentOption.hourly * currentOption.hours
                                    )}
                                  </Text>
                                ) : (
                                  <ChakraInput
                                    type="number"
                                    placeholder="Hours"
                                    value={currentOption[key]}
                                    isDisabled={!currentOption.active}
                                    onChange={(e) =>
                                      dispatch({
                                        type: actions.UPDATE_OPTION_VALUE,
                                        group,
                                        option,
                                        updateKey: key,
                                        updateValue: Number(e.target.value),
                                      })
                                    }
                                  />
                                )}
                              </Flex>
                            ))}
                          </Flex>
                        </Flex>
                      );
                    })}
                    <Flex>
                      <Flex w="40%" justify="flex-end">
                        <Heading size="sm" pr={4}>
                          {`${_.capitalize(group)} Subtotal`}
                        </Heading>
                      </Flex>
                      {groupSubtotals(group)}
                    </Flex>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>

      <Flex align="flex-end" borderTop="1px" borderTopColor="whiteAlpha.700">
        <Heading w="40%" textAlign="right" size="md" mb={2} pr={4}>
          Totals
        </Heading>
        {totalsRow()}
      </Flex>
    </Box>
  );
};

export default CalculatorForm;
