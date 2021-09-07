import {
  Button,
  ButtonProps as ChakraButtonProps,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react"
import { LinkProps as NextLinkProps } from "next/dist/client/link"
import { PropsWithChildren } from "react"
import Link from "./Link"

type Props = PropsWithChildren<NextLinkProps & ChakraLinkProps & ChakraButtonProps>

const LinkButton = ({
  href,
  replace,
  scroll,
  shallow,
  prefetch,
  variant,
  children,
  ...chakraProps
}: Props): JSX.Element => (
  <Link
    passHref
    href={href}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    prefetch={prefetch}
    _hover={{ textDecoration: "none" }}
  >
    <Button as="a" variant={variant} colorScheme="primary" {...chakraProps}>
      {children}
    </Button>
  </Link>
)

export default LinkButton
