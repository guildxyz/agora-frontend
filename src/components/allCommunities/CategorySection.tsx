import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
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

        <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />

        {!hasChildren && <Text>{placeholder}</Text>}
      </Stack>
    )
  }
)

export default CategorySection
