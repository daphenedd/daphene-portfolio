/**
 * Avatar — renders the student's picked avatar (1..AVATAR_COUNT).
 * If a corresponding image exists at src/assets/avatars/avatar-{n}.png it's
 * shown; otherwise a colored circle placeholder is used.
 */
import { Box } from "@chakra-ui/react";

export const AVATAR_COUNT = 6;

// Colors for placeholder circles when the image isn't uploaded yet.
// Stays in sync with AVATAR_COUNT — one entry per slot.
const AVATAR_COLOR_TOKENS = [
  "peach.300",
  "butter.300",
  "blush.300",
  "sage.300",
  "mint.200",
  "cream.300",
] as const;

const avatarImageMap: Record<number, string | null> = (() => {
  const out: Record<number, string | null> = {};
  for (let i = 1; i <= AVATAR_COUNT; i++) {
    try {
      out[i] = new URL(`../assets/avatars/avatar-${i}.png`, import.meta.url).href;
    } catch {
      out[i] = null;
    }
  }
  return out;
})();

export function getAvatarColor(id: number | null | undefined): string {
  if (!id || id < 1 || id > AVATAR_COUNT) return "cream.200";
  return AVATAR_COLOR_TOKENS[(id - 1) % AVATAR_COUNT];
}

export function getAvatarSrc(id: number | null | undefined): string | null {
  if (!id || id < 1 || id > AVATAR_COUNT) return null;
  return avatarImageMap[id] ?? null;
}

interface AvatarProps {
  id: number | null | undefined;
  size?: number | string;
  ring?: boolean;
}

export default function Avatar({ id, size = 40, ring = false }: AvatarProps) {
  const src = getAvatarSrc(id);
  const bg = getAvatarColor(id);
  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      bg={bg}
      overflow="hidden"
      flexShrink={0}
      position="relative"
      boxShadow={ring ? "0 0 0 2px var(--chakra-colors-cream-10)" : "none"}
    >
      {src && (
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => {
            // hide broken image so the colored bg shows
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </Box>
  );
}
