import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { MutableRefObject, forwardRef, useState, useEffect } from "react"

type Props = {
  title: string
  placeholder?: string
}

const CategorySection = forwardRef(
  ({ title, placeholder }: Props, ref: MutableRefObject<HTMLDivElement>) => {
    const [hasCommunities, setHasCommunities] = useState(false)
    const { account } = useWeb3React()

    useEffect(() => {
      const observer = new MutationObserver((records) => {
        // Removed this check since it shouldn't be necessary, since the observer shouldn't trigger if there was no MutationRecord
        // if (records.length) {
        setHasCommunities(!!records[0].target.childNodes.length)
        // }
      })
      observer.observe(ref.current, { childList: true })
      return () => observer.disconnect()
    }, [ref])

    return (
      <Stack spacing={4}>
        <Heading size="md" as="h4">
          {title}
        </Heading>

        {!hasCommunities &&
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
