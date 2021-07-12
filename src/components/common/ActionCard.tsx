import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react"
import Card from "./Card"

type ContentProps = {
  title: string
  description: string | JSX.Element[]
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
    <Wrap spacing="2" justify="flex-end" mt="auto" shouldWrapChildren>
      {children}
    </Wrap>
  </>
)

type Props = {
  withAccordion?: boolean
  opened?: boolean
  title: string
  description: string | JSX.Element[]
  children: JSX.Element | JSX.Element[]
}

const ActionCard = ({
  withAccordion = false,
  opened,
  title,
  description,
  children,
}: Props): JSX.Element => {
  if (!withAccordion) {
    return (
      <Card isFullWidthOnMobile p={6}>
        <ActionCardContent {...{ title, description, children }} />
      </Card>
    )
  }

  return (
    <>
      <Card
        isFullWidthOnMobile
        display={{ base: "block", md: "none" }}
        p={6}
        h="full"
      >
        <Accordion defaultIndex={opened && 0} allowMultiple>
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
              <Wrap spacing="2" justify="flex-end" mt="auto" shouldWrapChildren>
                {children}
              </Wrap>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card display={{ base: "none", md: "flex" }} p={6} h="full">
        <ActionCardContent {...{ title, description, children }} />
      </Card>
    </>
  )
}

export default ActionCard
