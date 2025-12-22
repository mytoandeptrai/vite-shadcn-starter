import DashboardHeaderUi from '../../components/dashboard-header-ui';
import DashboardSummaryChartUi from '../../components/dashboard-summary-chart-ui';
import { useDashboardSummaryContainer } from '../../hooks';

const DashboardSummaryContainers = () => {
  const { onSelect, options, selectedValue, t, chartData } = useDashboardSummaryContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-summary.title')}
        description={t('dashboard-summary.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardSummaryChartUi data={chartData} />
    </div>
  );
};

export default DashboardSummaryContainers;
