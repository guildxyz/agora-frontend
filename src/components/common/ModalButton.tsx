/* eslint-disable react/jsx-props-no-spreading */
import { Button } from "@chakra-ui/react"

type Props = {
  children?: string | JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const ModalButton = ({ children, ...rest }: Props): JSX.Element => (
  <Button w="100%" colorScheme="primary" size="lg" color="white" {...rest}>
    {children}
  </Button>
)

export default ModalButton
