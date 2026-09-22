/**
 * Student setup — pick one of 6 avatar slots + give yourself a name.
 * Avatar images go in src/assets/avatars/avatar-{1..6}.png; until they're
 * uploaded the page renders colored placeholder circles.
 */
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { createHomePageUrl } from "../urls";
import Avatar, { AVATAR_COUNT } from "../components/Avatar";

export default function StudentSetupPage() {
  const navigate = useNavigate();
  const setStudentRole = useStore((s) => s.setStudentRole);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const canSubmit = selectedId !== null && name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || selectedId === null) return;
    const studentId = `student-${Date.now()}`;
    setStudentRole("student", studentId, name.trim(), selectedId);
    navigate(createHomePageUrl());
  };

  const slots = Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1);

  return (
    <Box bg="surface.canvas" minH="100vh" position="relative" overflow="hidden">
      {/* Decorative pastel blobs */}
      <Box
        position="absolute"
        top="-80px"
        right="-60px"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="peach.100"
        filter="blur(10px)"
        opacity={0.5}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-80px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="butter.100"
        filter="blur(12px)"
        opacity={0.4}
        zIndex={0}
      />

      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 8 }}
        py={6}
        position="relative"
        zIndex={1}
      >
        <VStack spacing={6} w="full" maxW="520px">
          {/* Header */}
          <VStack spacing={1.5} textAlign="center">
            <Heading textStyle="h1" color="text.primary">
              Pick your buddy
            </Heading>
            <Text fontSize="sm" color="text.muted">
              Choose a character, then tell us your name.
            </Text>
          </VStack>

          {/* 3×2 avatar grid */}
          <SimpleGrid columns={3} spacing={4} w="full">
            {slots.map((id) => {
              const isSelected = selectedId === id;
              return (
                <Box
                  key={id}
                  as="button"
                  onClick={() => setSelectedId(id)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  py={3}
                  borderRadius="xl"
                  bg={isSelected ? "cream.50" : "transparent"}
                  transition="all 0.18s cubic-bezier(0.34, 1.4, 0.64, 1)"
                  _hover={{ bg: "cream.50" }}
                >
                  <Box
                    transform={isSelected ? "scale(1.05)" : "scale(1)"}
                    transition="transform 0.2s cubic-bezier(0.34, 1.4, 0.64, 1)"
                    boxShadow={
                      isSelected
                        ? "0 0 0 3px var(--chakra-colors-sage-400)"
                        : "none"
                    }
                    borderRadius="full"
                  >
                    <Avatar id={id} size={84} />
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Name input */}
          <Input
            placeholder="Type your name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            h="64px"
            bg="cream.10"
            border="2px solid"
            borderColor="border.subtle"
            borderRadius="lg"
            fontSize="lg"
            fontWeight="600"
            textAlign="center"
            px={6}
            _hover={{ borderColor: "border.default" }}
            _focus={{
              borderColor: "sage.400",
              boxShadow: "0 0 0 4px rgba(62, 160, 80, 0.18)",
            }}
          />

          {/* Submit — borderless green text link */}
          <Box
            as="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            color={canSubmit ? "sage.600" : "text.subtle"}
            fontSize="md"
            fontWeight="700"
            letterSpacing="-0.005em"
            cursor={canSubmit ? "pointer" : "not-allowed"}
            bg="transparent"
            border="none"
            outline="none"
            sx={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              boxShadow: "none !important",
            }}
            py={2}
            transition="color 0.18s, transform 0.18s"
            _hover={canSubmit ? { color: "sage.700", transform: "translateY(-1px)" } : {}}
            _active={canSubmit ? { color: "sage.800" } : {}}
            _focus={{ outline: "none", boxShadow: "none" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
          >
            Confirm, next step →
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
