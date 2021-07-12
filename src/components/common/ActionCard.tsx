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
  title: string
  description: string | JSX.Element[]
  children: JSX.Element | JSX.Element[]
}

const ActionCard = ({ title, description, children }: Props): JSX.Element => (
  <Card isFullWidthOnMobile p={6}>
    <ActionCardContent {...{ title, description, children }} />
  </Card>
)

export default ActionCard
