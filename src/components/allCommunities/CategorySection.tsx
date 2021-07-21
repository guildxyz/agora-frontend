import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { MutableRefObject, forwardRef, useState, useEffect } from "react"

type Props = {
  title: string
  placeholder?: string
}

const CategorySection = forwardRef(
  ({ title, placeholder }: Props, ref: MutableRefObject<HTMLDivElement>) => {
    const { account } = useWeb3React()
    /**
     * Since the CommunityCards are mounted into the category via Portal which
     * doesn't cause a rerender, we need to sync in a state if the category has
     * communities or not, so we can show the placeholder in case of emptiness
     */
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
      // MutationObserver will fire the callback every time the element's childList changes
      const observer = new MutationObserver((records) => {
        setIsEmpty(!records[0].target.childNodes.length)
      })
      observer.observe(ref.current, { childList: true })

      return () => observer.disconnect()
    }, [ref])

    return (
      <Stack spacing={4}>
        <Heading size="md" as="h4">
          {title}
        </Heading>

        {isEmpty && <Text>{!account ? "Wallet not connected" : placeholder}</Text>}

        <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />
      </Stack>
    )
  }
)

export default CategorySection
