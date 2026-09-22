/**
 * Card showing progress for a single gesture/move during data collection
 */
import { Box, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import CircularProgressBar from "./CircularProgressBar";

interface MoveProgressCardProps {
  gestureName: string;
  currentSamples: number;
  requiredSamples: number;
  studentCount: number;
  contributorCount: number;
  creatorName: string;
  isComplete?: boolean;
}

export const MoveProgressCard = ({
  gestureName,
  currentSamples,
  requiredSamples,
  studentCount,
  contributorCount,
  creatorName,
  isComplete = false,
}: MoveProgressCardProps) => {
  const colors = [
    "#3182ce",
    "#38a169",
    "#d69e2e",
    "#c53030",
    "#805ad5",
    "#0891b2",
  ];
  const colorIndex = gestureName.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <Box
      bg="white"
      borderRadius="lg"
      p={6}
      shadow="md"
      borderWidth={isComplete ? "3px" : "1px"}
      borderColor={isComplete ? color : "gray.200"}
      transition="all 0.3s ease"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
    >
      <VStack spacing={4} align="center">
        {/* Header with gesture name and status */}
        <HStack justify="space-between" width="100%">
          <Text fontSize="lg" fontWeight="bold" color={color}>
            {gestureName}
          </Text>
          {isComplete && (
            <Badge colorScheme="green" fontSize="md">
              ✓ Complete
            </Badge>
          )}
        </HStack>

        {/* Circular progress bar */}
        <CircularProgressBar
          current={currentSamples}
          total={requiredSamples}
          size="md"
          color={color}
        />

        {/* Stats */}
        <VStack spacing={2} width="100%">
          <HStack justify="space-between" width="100%" fontSize="md">
            <Text fontWeight="semibold">Created by:</Text>
            <Badge colorScheme="purple" fontSize="md">
              {creatorName}
            </Badge>
          </HStack>
          <HStack justify="space-between" width="100%" fontSize="xs" color="gray.900">
            <Text>Other contributors:</Text>
            <Text>{contributorCount > 0 ? contributorCount : "—"}</Text>
          </HStack>
          <HStack justify="space-between" width="100%" fontSize="sm" color="gray.600">
            <Text>Progress:</Text>
            <Text fontWeight="medium">
              {currentSamples} / {requiredSamples}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default MoveProgressCard;
