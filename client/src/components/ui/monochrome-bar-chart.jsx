"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {getMonthlyExpenses, getGroupMonthlyExpenses} from "@/getStats";
import { useAuth } from "@/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export function MonochromeBarChart({ className, type }) {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = React.useState(undefined);
  const [chartData, setChartData] = React.useState([]);
  const [expenseDiffPercentage, setExpenseDiffPercentage] = React.useState(0);
  const [totalExpenses, setTotalExpenses] = React.useState(0);
  
  const chartConfig = {
    desktop: {
      label: type === 'personal' ? "Personal" : "Group",
      color: "var(--secondary-foreground)",
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  React.useEffect(() => {
    async function loadData() {
      let formattedData = [];
      
      if(type === 'personal'){
        const {monthlyExpenses, expenseDiffPercentage, totalExpenses} = await getMonthlyExpenses();
        formattedData = monthNames.map((month, index) => ({
          month: month,
          desktop: monthlyExpenses[index] || 0
        }));
        setChartData(formattedData);
        setExpenseDiffPercentage(expenseDiffPercentage);
        setTotalExpenses(totalExpenses);
      }else if(type === 'group' && user?.id){
        const {monthlyExpenses, expenseDiffPercentage, totalExpenses} = await getGroupMonthlyExpenses(user.id);
        formattedData = monthNames.map((month, index) => ({
          month: month,
          desktop: monthlyExpenses[index] || 0
        }));
        setChartData(formattedData);
        setExpenseDiffPercentage(expenseDiffPercentage);
        setTotalExpenses(totalExpenses);
      }
    }

    loadData();
  }, [type, user?.id]);

  const activeData = React.useMemo(() => {
    if (activeIndex === undefined) return null;
    return chartData[activeIndex];
  }, [activeIndex, chartData]);

  return (
    <Card className={`${className} border-0 border-white/30`} style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="font-jetbrains text-2xl tracking-tighter text-black dark:text-white">
          ${activeData ? activeData.desktop.toFixed(2) : `${totalExpenses.toFixed(2)}`}
          </span>
          <Badge variant="secondary">
            {expenseDiffPercentage > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
            <span>{expenseDiffPercentage.toFixed(2)}%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-black dark:text-white">vs. previous month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <AnimatePresence mode="wait">
          <ChartContainer config={chartConfig} className="h-full w-full [&_.recharts-cartesian-grid_line]:!hidden [&_.recharts-cartesian-grid]:!hidden">
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
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0} />
              <Bar
                dataKey="desktop"
                fill="white"
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
          ${value.toFixed(2)}
        </motion.text>
      )}
    </g>
  );
};
