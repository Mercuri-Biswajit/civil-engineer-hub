/**
 * Layout Components
 *
 * A set of layout components for building responsive pages.
 *
 * Components:
 * - Container: Centered container with max-width
 * - Section: Vertical spacing container
 * - Flex: Flexbox utility
 * - Grid: CSS Grid utility
 * - Stack: Vertical/Horizontal stack with gap
 * - Divider: Horizontal line separator
 *
 * Example Usage:
 * <Container>
 *   <Section>
 *     <Stack gap="md">
 *       Content here
 *     </Stack>
 *   </Section>
 * </Container>
 */

import React from "react";
import PropTypes from "prop-types";

// ═══════════════════════════════════════════════════════════════════════════
// CONTAINER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Container Component
 * A centered container with responsive max-width
 */
const Container = ({
  children,
  size = "default", // 'sm' | 'default' | 'lg' | 'xl' | 'full'
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "max-w-3xl",
    default: "max-w-7xl",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  };

  const containerClasses = [
    "mx-auto",
    "px-4",
    "sm:px-6",
    "lg:px-8",
    sizeStyles[size] || sizeStyles.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["sm", "default", "lg", "xl", "full"]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Section Component
 * A container with vertical spacing
 */
const Section = ({
  children,
  size = "default", // 'none' | 'sm' | 'default' | 'lg' | 'xl'
  className = "",
  ...props
}) => {
  const sizeStyles = {
    none: "py-0",
    sm: "py-4 md:py-6",
    default: "py-8 md:py-12",
    lg: "py-12 md:py-16",
    xl: "py-16 md:py-24",
  };

  const sectionClasses = [
    "w-full",
    sizeStyles[size] || sizeStyles.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClasses} {...props}>
      {children}
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["none", "sm", "default", "lg", "xl"]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// FLEX
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Flex Component
 * Flexbox container with common patterns
 */
const Flex = ({
  children,
  direction = "row", // 'row' | 'column' | 'row-reverse' | 'column-reverse'
  align = "stretch", // 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  justify = "start", // 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  gap, // '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12'
  wrap = false,
  className = "",
  ...props
}) => {
  const directionStyles = {
    row: "flex-row",
    column: "flex-col",
    "row-reverse": "flex-row-reverse",
    "column-reverse": "flex-col-reverse",
  };

  const alignStyles = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyStyles = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const gapStyles = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  };

  const flexClasses = [
    "flex",
    directionStyles[direction],
    alignStyles[align],
    justifyStyles[justify],
    gap ? gapStyles[gap] : "",
    wrap ? "flex-wrap" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
};

Flex.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf([
    "row",
    "column",
    "row-reverse",
    "column-reverse",
  ]),
  align: PropTypes.oneOf(["start", "end", "center", "stretch", "baseline"]),
  justify: PropTypes.oneOf([
    "start",
    "end",
    "center",
    "between",
    "around",
    "evenly",
  ]),
  gap: PropTypes.oneOf(["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"]),
  wrap: PropTypes.bool,
  className: PropTypes.string,
};

// Inline Flex variant
Flex.Inline = function FlexInline({ children, ...props }) {
  return (
    <Flex {...props} className={`inline-flex ${props.className || ""}`}>
      {children}
    </Flex>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GRID
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Grid Component
 * CSS Grid container with common patterns
 */
const Grid = ({
  children,
  cols = 1, // 1-12 or { default: 1, sm: 2, md: 3, etc. }
  gap = 4,
  className = "",
  ...props
}) => {
  // Handle responsive columns object
  if (typeof cols === "object") {
    const responsiveClasses = Object.entries(cols)
      .map(([breakpoint, value]) => {
        const breakpointPrefix =
          breakpoint === "default" ? "" : `${breakpoint}:`;
        return `${breakpointPrefix}grid-cols-${value}`;
      })
      .join(" ");

    return (
      <div
        className={`grid ${responsiveClasses} gap-${gap} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-${cols} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Grid.propTypes = {
  children: PropTypes.node,
  cols: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  gap: PropTypes.oneOf(["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"]),
  className: PropTypes.string,
};

// Grid columns variant
Grid.Auto = function GridAuto({
  children,
  minWidth = "200px",
  gap = 4,
  className = "",
  ...props
}) {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STACK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Stack Component
 * A simpler vertical or horizontal stack
 */
const Stack = ({
  children,
  direction = "vertical", // 'vertical' | 'horizontal'
  gap = 4, // 1-12
  align = "start", // 'start' | 'center' | 'end' | 'stretch'
  className = "",
  ...props
}) => {
  const directionClass = direction === "vertical" ? "flex-col" : "flex-row";

  const alignStyles = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const gapStyles = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  };

  return (
    <div
      className={`flex ${directionClass} ${alignStyles[align]} ${gapStyles[gap] || `gap-${gap}`} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
  gap: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 8, 10, 12]),
  align: PropTypes.oneOf(["start", "center", "end", "stretch"]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Divider Component
 * A horizontal line separator
 */
const Divider = ({ className = "", ...props }) => {
  return <hr className={`border-neutral-200 my-4 ${className}`} {...props} />;
};

Divider.propTypes = {
  className: PropTypes.string,
};

// Label Divider (with text)
Divider.Label = function DividerWithLabel({ label, className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-neutral-200" />
      {label && (
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SPACER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spacer Component
 * Creates vertical spacing
 */
const Spacer = ({ size = 4, className = "" }) => {
  const sizeStyles = {
    1: "h-1",
    2: "h-2",
    3: "h-3",
    4: "h-4",
    5: "h-5",
    6: "h-6",
    8: "h-8",
    10: "h-10",
    12: "h-12",
    16: "h-16",
    20: "h-20",
  };

  return (
    <div
      className={`flex-shrink-0 ${sizeStyles[size] || `h-${size}`} ${className}`}
    />
  );
};

Spacer.propTypes = {
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20]),
  className: PropTypes.string,
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

const Layout = {
  Container,
  Section,
  Flex,
  Grid,
  Stack,
  Divider,
  Spacer,
};

export default Layout;
export { Container, Section, Flex, Grid, Stack, Divider, Spacer };
