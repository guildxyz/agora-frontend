import { Box, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  title: string
  description?: string
  children: JSX.Element
}

const Section = ({ title, description, children }: Props): JSX.Element => (
  <VStack as="section" width="full" alignItems="start" spacing={4}>
    <Box pl={4}>
      <Text as="h2" fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {description}
        </Text>
      )}
    </Box>

    <Card width="full" padding={8}>
      {children}
    </Card>
  </VStack>
)

export default Section
