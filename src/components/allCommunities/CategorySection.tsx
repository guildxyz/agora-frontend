import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import {
  MutableRefObject,
  forwardRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react"

type Props = {
  title: string
  placeholder?: string
}

const CategorySection = forwardRef(
  ({ title, placeholder }: Props, ref: MutableRefObject<HTMLDivElement>) => {
    const [hasChildren, setHasChildren] = useState(false)
    const { account } = useWeb3React()

    useEffect(() => {
      ref.current.addEventListener("DOMNodeInserted", () => {
        if (!hasChildren) setHasChildren(true)
      })
    }, [ref])

    return (
      <Stack spacing={4}>
        <Heading size="md" as="h4">
          {title}
        </Heading>

        {!hasChildren &&
          (!account ? (
            <Text>Wallet not connected</Text>
          ) : (
            <Text>{placeholder}</Text>
          ))}

        <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />
      </Stack>
    )
  }
)

export default CategorySection
