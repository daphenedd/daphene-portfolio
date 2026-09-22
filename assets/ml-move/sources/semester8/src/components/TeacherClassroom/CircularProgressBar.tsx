/**
 * Circular progress bar component for showing move/sample completion
 * Displays as a circle with fill percentage and centered number indicator
 */
import { Box, Text, VStack } from "@chakra-ui/react";

interface CircularProgressBarProps {
  current: number;
  total: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const CircularProgressBar = ({
  current,
  total,
  label,
  size = "md",
  color = "#3182ce",
}: CircularProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeConfig = {
    sm: { container: 100, text: "sm", labelText: "xs" },
    md: { container: 140, text: "2xl", labelText: "sm" },
    lg: { container: 180, text: "4xl", labelText: "md" },
  };

  const config = sizeConfig[size];

  return (
    <VStack spacing={2}>
      <Box position="relative" width={config.container} height={config.container}>
        {/* Background circle */}
        <svg
          width={config.container}
          height={config.container}
          style={{
            transform: "rotate(-90deg)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Background track */}
          <circle
            cx={config.container / 2}
            cy={config.container / 2}
            r="45"
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress track */}
          <circle
            cx={config.container / 2}
            cy={config.container / 2}
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>

        {/* Center text */}
        <VStack
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          spacing={0}
        >
          <Text fontSize={config.text} fontWeight="bold" color={color}>
            {current}/{total}
          </Text>
        </VStack>
      </Box>

      {/* Label */}
      {label && (
        <Text fontSize={config.labelText} fontWeight="medium" textAlign="center">
          {label}
        </Text>
      )}
    </VStack>
  );
};

export default CircularProgressBar;
