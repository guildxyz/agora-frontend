import {
  Heading,
  Text,
  Stack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
} from "@chakra-ui/react"
import Card from "./Card"

type ContentProps = {
  title: string
  description: string
  children: JSX.Element | JSX.Element[]
}

const ActionCardContent = ({ title, description, children }: ContentProps) => (
  <>
    <Heading size="sm" mb="2">
      {title}
    </Heading>
    <Text mb="6" fontWeight="medium">
      {description}
    </Text>
    <HStack spacing="2" justifyContent="flex-end" mt="auto">
      {children}
    </HStack>
  </>
)

type Props = {
  withAccordion?: boolean
  title: string
  description: string
  children: JSX.Element | JSX.Element[]
}

const ActionCard = ({
  withAccordion = false,
  title,
  description,
  children,
}: Props): JSX.Element => {
  if (!withAccordion) {
    return (
      <Card p={6}>
        <ActionCardContent {...{ title, description, children }} />
      </Card>
    )
  }

  return (
    <>
      <Card display={{ base: "block", md: "none" }} p={6}>
        <Accordion allowMultiple>
          <AccordionItem border="none">
            <AccordionButton p="0" _hover={{ bg: "none" }}>
              <Stack
                w="full"
                justifyContent="space-between"
                justifyItems="center"
                direction="row"
              >
                <Heading size="sm">{title}</Heading>
                <AccordionIcon />
              </Stack>
            </AccordionButton>

            <AccordionPanel p="0">
              <Text pt="2" mb="6" fontWeight="medium">
                {description}
              </Text>
              <HStack spacing="2" justifyContent="flex-end" mt="auto">
                {children}
              </HStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card display={{ base: "none", md: "block" }} p={6}>
        <ActionCardContent {...{ title, description, children }} />
      </Card>
    </>
  )
}

export default ActionCard
