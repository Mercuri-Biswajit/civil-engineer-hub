/**
 * UI Component Library
 *
 * A comprehensive, themeable component library for React applications.
 *
 * This is the main entry point for all UI components.
 *
 * Usage:
 * import { Button, Card, Container, Section } from '@/components/ui';
 *
 * Or import specific categories:
 * import { Button, Input } from '@/components/ui/primitives';
 * import { Container, Section } from '@/components/ui/layout';
 */

// Primitives (basic UI components)
export * from "./primitives";

// Layout components
export * from "./layout";

// Re-export from individual files for convenience
export { default as Button } from "./primitives/Button";
export { default as Input } from "./primitives/Input";
export { default as Select } from "./primitives/Select";
export { default as Card } from "./primitives/Card";
export { default as Badge } from "./primitives/Badge";
export { default as Avatar } from "./primitives/Avatar";
export {
  default as Loading,
  Spinner,
  PageLoader,
  Skeleton,
  DotsLoader,
} from "./primitives/Loading";
export { default as EmptyState } from "./primitives/EmptyState";

export { default as Layout } from "./layout/Container";
export { default as Container } from "./layout/Container";
export { default as Section } from "./layout/Container";
export { default as Flex } from "./layout/Container";
export { default as Grid } from "./layout/Container";
export { default as Stack } from "./layout/Container";
export { default as Divider } from "./layout/Container";
export { default as Spacer } from "./layout/Container";
