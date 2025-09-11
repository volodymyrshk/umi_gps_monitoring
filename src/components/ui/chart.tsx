"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: Record<string, any>
    children: React.ComponentProps<typeof ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs",
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
        "[&_.recharts-cartesian-grid_line]:stroke-border/50",
        "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
        "[&_.recharts-dot]:stroke-transparent",
        "[&_.recharts-layer]:outline-none",
        "[&_.recharts-sector]:outline-none",
        "[&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: Record<string, any> }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, itemConfig]) => itemConfig.theme || itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .filter(([_, itemConfig]) => itemConfig.theme || itemConfig.color)
          .map(([key, itemConfig]) => {
            const color = itemConfig.theme?.light ?? itemConfig.color
            return color ? `  --color-${key}: ${color};` : null
          })
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean
    payload?: any[]
    label?: any
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "dot" | "line"
    formatter?: (value: any, name: any) => React.ReactNode
    labelFormatter?: (value: any, payload?: any[]) => React.ReactNode
    className?: string
  }
>(({ 
  active, 
  payload, 
  label, 
  hideLabel = false, 
  hideIndicator = false,
  indicator = "dot",
  formatter,
  labelFormatter,
  className,
  ...props 
}, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
      {...props}
    >
      {!hideLabel && label && (
        <div className="font-medium">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex w-full items-center gap-2",
              indicator === "dot" && "items-center"
            )}
          >
            {!hideIndicator && (
              <div
                className={cn(
                  "shrink-0 rounded-[2px]",
                  {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1 h-2.5": indicator === "line",
                  }
                )}
                style={{
                  backgroundColor: item.color || item.payload?.fill
                }}
              />
            )}
            <div className="flex flex-1 justify-between leading-none">
              <span className="text-muted-foreground">
                {item.name}
              </span>
              {item.value && (
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatter ? formatter(item.value, item.name) : item.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
}

export type ChartConfig = Record<string, {
  label?: React.ReactNode
  icon?: React.ComponentType
  color?: string
  theme?: Record<string, string>
}>