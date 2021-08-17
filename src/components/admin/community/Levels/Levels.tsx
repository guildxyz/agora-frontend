import { Button, Divider, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "phosphor-react"
import { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import AddLevel from "./components/AddLevel"

const Levels = (): JSX.Element => {
  const {
    fields: levelFields,
    append: appendLevel,
    remove: removeLevel,
  } = useFieldArray({
    name: "levels",
  })

  useEffect(() => {
    if (levelFields.length === 0) {
      appendLevel(
        {
          name: "",
          image: null,
          description: "",
          requirementType: "OPEN",
          requirement: null,
          tokenTimeLock: null,
          telegramGroupId: null,
        },
        { shouldFocus: false }
      )
    }
  }, [])

  return (
    <Section
      title="Levels"
      description="Ordered from the most accessible to the most VIP one. Each one gives access to the lower levels too"
    >
      <>
        {levelFields.length > 0 ? (
          <VStack width="full" spacing={8}>
            {levelFields.map((levelField, index) => (
              <AnimatePresence key={levelField.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, width: "100%" }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                >
                  <AddLevel index={index} onRemove={() => removeLevel(index)} />
                </motion.div>
              </AnimatePresence>
            ))}
          </VStack>
        ) : (
          <Text colorScheme="gray" pl={4}>
            There aren't any levels
          </Text>
        )}

        <HStack width="full" spacing={2}>
          <Divider borderBottomWidth={2} borderColor="primary.300" />
          <Button
            width={60}
            variant="ghost"
            colorScheme="primary"
            leftIcon={<Icon as={Plus} />}
            onClick={() =>
              appendLevel({
                name: "",
                image: null,
                description: "",
                requirementType: "OPEN",
                requirement: null,
                tokenTimeLock: null,
                telegramGroupId: null,
              })
            }
          >
            Add level
          </Button>
          <Divider borderBottomWidth={2} borderColor="primary.300" />
        </HStack>
      </>
    </Section>
  )
}

export default Levels
