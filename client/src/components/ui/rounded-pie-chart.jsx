"use client";
import React from "react";
import { LabelList, Pie, PieChart } from "recharts";
import { getCategoryExpenses, getGroupWiseExpenses } from "@/getStats";
import { useAuth } from "@/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function RoundedPieChart({ className, type }) {
  const { user } = useAuth();
  const [chartData, setChartData] = React.useState([]);
  const [totalExpenses, setTotalExpenses] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      if(type === 'personal'){
        const expensesByCategory = await getCategoryExpenses();
        const formattedData = Object.keys(expensesByCategory).map((category, index) => ({
          category: category,
          visitors: expensesByCategory[category],
          fill: `var(--chart-${(index % 5) + 1})`,
        }));
        const total = Object.values(expensesByCategory).reduce((sum, val) => sum + parseFloat(val), 0);
        setChartData(formattedData);
        setTotalExpenses(total);
      }else if(type === 'group' && user?.id){
        const expensesByGroup = await getGroupWiseExpenses(user.id);
        const formattedData = Object.keys(expensesByGroup).map((group, index) => ({
          group: group,
          visitors: expensesByGroup[group],
          fill: `var(--chart-${(index % 5) + 1})`,
        }));
        const total = Object.values(expensesByGroup).reduce((sum, val) => sum + parseFloat(val), 0);
        setChartData(formattedData);
        setTotalExpenses(total);
      }
    }

    loadData();
  }, [type, user?.id]);
  
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl font-bold text-black dark:text-white">
          {type === 'personal' ? 'Category Wise Expenses' : 'Group Wise Expenses'} 
        </CardTitle>
        <CardDescription className="text-sm text-black dark:text-white">Total Expenses: ${totalExpenses.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            visitors: {
              label: type === 'personal' ? 'Category' : 'Group',
              color: 'var(--chart-1)',
            },
          }}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip 
              content={<ChartTooltipContent 
                nameKey={type === 'personal' ? 'category' : 'group'} 
                hideLabel
                formatter={(value, name, item) => {
                  const expenseValue = item?.payload?.visitors || value;
                  const labelName = item?.payload?.[type === 'personal' ? 'category' : 'group'] || name;
                  const indicatorColor = item?.payload?.fill || item?.color;
                  return (
                    <div className="flex w-full flex-wrap items-stretch gap-2 items-center">
                      <div
                        className="shrink-0 rounded-[2px] h-2.5 w-2.5"
                        style={{
                          backgroundColor: indicatorColor,
                          borderColor: indicatorColor
                        }} />
                      <div className="flex flex-1 justify-between leading-none items-center">
                        <div className="grid gap-1.5">
                          <span className="text-muted-foreground">
                            {labelName}
                          </span>
                        </div>
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          ${parseFloat(expenseValue).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />} 
            />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey="visitors"
              radius="100%"
              cornerRadius={8}
              paddingAngle={4}>
              <LabelList
                dataKey={type === 'personal' ? 'category' : 'group'}
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor" 
                formatter={(value) => value.toString()} />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
