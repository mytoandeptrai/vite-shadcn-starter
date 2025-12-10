import DashboardChartUi from '../../components/dashboard-chart-ui';
import DashboardHeaderUi from '../../components/dashboard-header-ui';
import { useDashboardSummaryContainer } from '../../hooks';

const DashboardSummaryContainers = () => {
  const { onSelect, options, selectedValue, t, chartData, chartConfig } = useDashboardSummaryContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-summary.title')}
        description={t('dashboard-summary.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardChartUi data={chartData} chartConfig={chartConfig} />
    </div>
  );
};

export default DashboardSummaryContainers;
