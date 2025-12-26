import DashboardHeaderUi from '../../components/dashboard-header-ui';
import DashboardSummaryChartUi from '../../components/dashboard-summary-chart-ui';
import DashboardSummaryInfoUi from '../../components/dashboard-summary-info-ui';
import { useDashboardSummaryContainer } from '../../hooks';

const DashboardSummaryContainers = () => {
  const { onSelect, options, selectedValue, t, chartData, isLoading } = useDashboardSummaryContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-summary.title')}
        description={t('dashboard-summary.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardSummaryChartUi data={chartData.data} isLoading={isLoading} />
      <DashboardSummaryInfoUi totalOrders={chartData.totalOrders} averageOrdersPerDay={chartData.averageOrdersPerDay} />
    </div>
  );
};

export default DashboardSummaryContainers;
