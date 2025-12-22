import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

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
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.3} />

        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />

        <Line
          type='monotone'
          dataKey='mobile'
          stroke='var(--color-stroke-mobile)'
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />

        <Line
          type='monotone'
          dataKey='desktop'
          stroke='var(--color-stroke-desktop)'
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DashboardChartUi;
