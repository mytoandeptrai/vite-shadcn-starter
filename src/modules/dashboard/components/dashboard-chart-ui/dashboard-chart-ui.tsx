import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'A stacked area chart';

type DashboardChartUiProps = {
  data: {
    month: string;
    desktop: number;
    mobile: number;
  }[];
  chartConfig: ChartConfig;
};

const DashboardChartUi = ({ data, chartConfig }: DashboardChartUiProps) => {
  return (
    <ChartContainer config={chartConfig} className='h-[300px] w-full'>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
        <Area
          dataKey='mobile'
          type='natural'
          fill='var(--color-mobile)'
          fillOpacity={0.4}
          stroke='var(--color-mobile)'
          stackId='a'
        />
        <Area
          dataKey='desktop'
          type='natural'
          fill='var(--color-desktop)'
          fillOpacity={0.4}
          stroke='var(--color-desktop)'
          stackId='a'
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default DashboardChartUi;