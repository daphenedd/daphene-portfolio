/**
 * Data collection in progress — circular progress per gesture.
 * When every gesture has reached its sample target, switches to a "Done" hero.
 */
import {
  VStack,
  HStack,
  Button,
  Box,
  Text,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Heading,
  keyframes,
} from "@chakra-ui/react";
import { RiCheckboxCircleFill, RiStopCircleFill } from "react-icons/ri";
import MoveProgressCard from "../../components/TeacherClassroom/MoveProgressCard";
import TeacherNavMenu from "../../components/TeacherClassroom/TeacherNavMenu";

interface GestureProgress {
  gestureId: string;
  gestureName: string;
  currentSamples: number;
  requiredSamples: number;
  studentCount: number;
  contributorCount: number;
  creatorName: string;
  isComplete: boolean;
}

interface DataCollectionScreenProps {
  gestures: GestureProgress[];
  studentCount: number;
  onEnd: () => void;
  isLoading?: boolean;
  doneTarget?: number;
  totalRecordings?: number;
}

const popIn = keyframes`
  0%   { transform: scale(0.85); opacity: 0; }
  60%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export const DataCollectionScreen = ({
  gestures,
  studentCount,
  onEnd,
  isLoading = false,
  doneTarget = 0,
  totalRecordings = 0,
}: DataCollectionScreenProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const completedCount = gestures.filter((g) => g.isComplete).length;
  const allComplete = doneTarget > 0 ? totalRecordings >= doneTarget : completedCount === gestures.length && gestures.length > 0;

  const handleConfirmEnd = () => {
    onEnd();
    onClose();
  };

  return (
    <Box
      width="100%"
      minH="100vh"
      bg="surface.canvas"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative pastel blobs (shift to green when done) */}
      <Box
        position="absolute"
        top="-100px"
        right="-80px"
        w="380px"
        h="380px"
        borderRadius="full"
        bg={allComplete ? "sage.200" : "peach.100"}
        filter="blur(14px)"
        opacity={0.45}
        pointerEvents="none"
        transition="background 0.6s ease"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-100px"
        w="420px"
        h="420px"
        borderRadius="full"
        bg={allComplete ? "sage.100" : "butter.100"}
        filter="blur(14px)"
        opacity={0.4}
        pointerEvents="none"
        transition="background 0.6s ease"
      />

      {/* Top bar */}
      <HStack
        justify="space-between"
        align="flex-start"
        px={{ base: 6, md: 10 }}
        py={6}
        position="relative"
        zIndex={1}
      >
        <VStack align="flex-start" spacing={0}>
          <Text
            fontSize="11px"
            fontWeight="700"
            letterSpacing="0.16em"
            textTransform="uppercase"
            color={allComplete ? "sage.700" : "text.subtle"}
          >
            {allComplete ? "Done · Ready to train" : "Recording · Live"}
          </Text>
          <Heading textStyle="h1" color="text.primary">
            {allComplete ? "All moves complete" : "Data collection"}
          </Heading>
          <HStack spacing={3} mt={1}>
            <StatPill label="Students" value={studentCount} accent="sage" />
            <StatPill
              label="Moves"
              value={`${completedCount}/${gestures.length || 0}`}
              accent={allComplete ? "sage" : "peach"}
            />
          </HStack>
        </VStack>
        <TeacherNavMenu showResetOption />
      </HStack>

      {/* Main content */}
      <Box
        position="relative"
        zIndex={1}
        px={{ base: 6, md: 10 }}
        pb={32}
        minH="calc(100vh - 200px)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {gestures.length === 0 ? (
          <VStack spacing={3} textAlign="center" py={16}>
            <Heading fontSize="2xl" color="text.muted" fontWeight="600">
              Waiting for students to start creating moves…
            </Heading>
            <Text fontSize="md" color="text.subtle">
              {studentCount} student{studentCount === 1 ? "" : "s"} connected
            </Text>
          </VStack>
        ) : allComplete ? (
          <VStack spacing={5} textAlign="center" py={6} animation={`${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`}>
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              bg="sage.500"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="64px"
              boxShadow="chunkyBrand"
            >
              <RiCheckboxCircleFill />
            </Box>
            <VStack spacing={1}>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="-0.022em"
                color="text.primary"
              >
                Done! 🎉
              </Heading>
              <Text fontSize="md" color="text.muted" maxW="480px">
                Every move has enough samples. Press{" "}
                <Text as="span" fontWeight="700" color="text.primary">
                  End training
                </Text>{" "}
                to move on to model training.
              </Text>
            </VStack>
            {/* Mini gesture summary */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2.5} w="full" maxW="640px" pt={3}>
              {gestures.map((g) => (
                <HStack
                  key={g.gestureId}
                  px={3}
                  py={2}
                  bg="cream.10"
                  border="0.5px solid"
                  borderColor="sage.200"
                  borderRadius="lg"
                  spacing={2}
                >
                  <Box w="18px" h="18px" borderRadius="full" bg="sage.500" color="white" display="flex" alignItems="center" justifyContent="center" fontSize="11px">
                    <RiCheckboxCircleFill />
                  </Box>
                  <Text fontSize="sm" fontWeight="600" color="text.primary" noOfLines={1}>
                    {g.gestureName}
                  </Text>
                  <Text fontSize="xs" color="text.muted" ml="auto" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {g.currentSamples}/{g.requiredSamples}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
            {gestures.map((gesture) => (
              <MoveProgressCard
                key={gesture.gestureId}
                gestureName={gesture.gestureName}
                currentSamples={gesture.currentSamples}
                requiredSamples={gesture.requiredSamples}
                studentCount={gesture.studentCount}
                contributorCount={gesture.contributorCount}
                creatorName={gesture.creatorName}
                isComplete={gesture.isComplete}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Footer — End button (always visible at bottom) */}
      <HStack
        justify="center"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        py={5}
        bg="rgba(248, 246, 240, 0.85)"
        backdropFilter="blur(20px)"
        borderTop="0.5px solid"
        borderColor="border.subtle"
        zIndex={2}
      >
        <Button
          size="lg"
          onClick={onOpen}
          bg={allComplete ? "sage.500" : "cream.10"}
          color={allComplete ? "white" : "blush.700"}
          border={allComplete ? "none" : "0.5px solid"}
          borderColor={allComplete ? "transparent" : "blush.300"}
          h="48px"
          px={10}
          fontSize="md"
          fontWeight="700"
          borderRadius="lg"
          isLoading={isLoading}
          leftIcon={allComplete ? <RiCheckboxCircleFill /> : <RiStopCircleFill />}
          _hover={{
            bg: allComplete ? "sage.600" : "cream.50",
            transform: "translateY(-1px)",
          }}
          _active={{ transform: "scale(0.97)" }}
          transition="all 0.15s ease"
          boxShadow={allComplete ? "chunkyBrand" : "0 0.5px 0 rgba(0,0,0,0.04)"}
        >
          {allComplete ? "Continue to training" : "End training"}
        </Button>
      </HStack>

      {/* End confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="2xl" mx={4}>
          <ModalHeader fontSize="lg" fontWeight="700" pb={1}>
            {allComplete ? "Move on to training?" : "End early?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <Text fontSize="sm" color="text.muted">
              {allComplete
                ? "Great work — every move has enough samples. Ready to train the model?"
                : `Only ${completedCount} of ${gestures.length} moves are complete. Recording will stop and progress will be saved.`}
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>
              {allComplete ? "Not yet" : "Keep recording"}
            </Button>
            <Button
              bg={allComplete ? "sage.500" : "blush.500"}
              color="white"
              _hover={{ bg: allComplete ? "sage.600" : "blush.600" }}
              onClick={handleConfirmEnd}
            >
              {allComplete ? "Train model" : "End training"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const StatPill = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "sage" | "peach";
}) => (
  <HStack
    spacing={1.5}
    px={2.5}
    py={1}
    bg={`${accent}.50`}
    border="0.5px solid"
    borderColor={`${accent}.200`}
    borderRadius="full"
  >
    <Text fontSize="11px" fontWeight="600" color={`${accent}.700`} textTransform="uppercase" letterSpacing="0.04em">
      {label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color="text.primary" sx={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </Text>
  </HStack>
);

export default DataCollectionScreen;
