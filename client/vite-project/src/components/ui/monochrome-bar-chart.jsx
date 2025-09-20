"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {getMonthlyExpenses} from "@/getStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--secondary-foreground)",
  }
};

export function MonochromeBarChart({ className }) {
  const [activeIndex, setActiveIndex] = React.useState(undefined);
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    async function loadData() {
      const expensesByMonth = await getMonthlyExpenses();
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      const formattedData = monthNames.map((month, index) => ({
        month: month,
        desktop: expensesByMonth[index] || 0
      }));

      setChartData(formattedData);
    }

    loadData();
  }, []);

  const activeData = React.useMemo(() => {
    if (activeIndex === undefined) return null;
    return chartData[activeIndex];
  }, [activeIndex, chartData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="font-jetbrains text-2xl tracking-tighter">
            ${activeData ? activeData.desktop : "123"}
          </span>
          <Badge variant="secondary">
            <TrendingUp className="h-4 w-4" />
            <span>5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>vs. last quarter</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              onMouseLeave={() => setActiveIndex(undefined)}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)} />
              <Bar
                dataKey="desktop"
                fill="var(--secondary-foreground)"
                shape={
                  <CustomBar setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
                }></Bar>
            </BarChart>
          </ChartContainer>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

const CustomBar = (props) => {
  const { fill, x, y, width, height, index, activeIndex, value } = props;

  // Custom variables
  const xPos = Number(x || 0);
  const realWidth = Number(width || 0);
  const isActive = index === activeIndex;
  const collapsedWidth = 2;
  // centered bar x-position
  const barX = isActive ? xPos : xPos + (realWidth - collapsedWidth) / 2;
  // centered text x-position
  const textX = xPos + realWidth / 2;
  // Custom bar shape
  return (
    <g onMouseEnter={() => props.setActiveIndex(index)}>
      {/* rendering the bar with custom postion and animated width */}
      <motion.rect
        style={{
          willChange: "transform, width", // helps with performance
        }}
        y={y}
        initial={{ width: collapsedWidth, x: barX }}
        animate={{ width: isActive ? realWidth : collapsedWidth, x: barX }}
        transition={{
          duration: activeIndex === index ? 0.5 : 1,
          type: "spring",
        }}
        height={height}
        fill={fill} />
      {/* Render value text on top of bar */}
      {isActive && (
        <motion.text
          style={{
            willChange: "transform, opacity", // helps with performance
          }}
          className="font-jetbrains"
          key={index}
          initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.1 }}
          x={textX}
          y={Number(y) - 5}
          textAnchor="middle"
          fill={fill}>
          {value}
        </motion.text>
      )}
    </g>
  );
};
