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
      /*
        The community cards are being inserted to the grid with chakra Portal.
        This is a solution to react to this event, since we can't really detect this change in react,
          because these events don't change the refs (they just change some properties of the element, not the object reference)
        With the MutationObserver we can observe (subscribe) to different events, here we are observing childList changes,
          this can be addition or deletion. This is specified in the observe method: { childList: true }.
        The callback passed to MutationObserver is ran every time an observed event happens
          (or more, this is why records is a MutationRecord[]).
        So every time a child addition or deletion happens, we just set the state according to target.childNodes.length
      */
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

        {!hasCommunities && (
          <Text>{!account ? "Wallet not connected" : placeholder}</Text>
        )}

        <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />
      </Stack>
    )
  }
)

export default CategorySection
