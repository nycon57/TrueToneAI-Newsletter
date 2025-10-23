"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => {
    // Perform shallow equality check across all props
    if (prevProps.children !== nextProps.children) return false;
    if (prevProps.className !== nextProps.className) return false;

    // Check other props
    const prevKeys = Object.keys(prevProps) as Array<keyof ResponseProps>;
    const nextKeys = Object.keys(nextProps) as Array<keyof ResponseProps>;

    if (prevKeys.length !== nextKeys.length) return false;

    for (const key of prevKeys) {
      if (key !== 'children' && key !== 'className' && prevProps[key] !== nextProps[key]) {
        return false;
      }
    }

    return true;
  }
);

Response.displayName = "Response";
