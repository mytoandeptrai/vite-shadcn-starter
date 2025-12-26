import DashboardApiChartUi from '../../components/dashboard-api-chart-ui';
import DashboardHeaderUi from '../../components/dashboard-header-ui';
import { useDashboardApiContainer } from '../../hooks';

const DashboardApiContainer = () => {
  const { onSelect, options, selectedValue, t, chartData, isLoading } = useDashboardApiContainer();
  return (
    <div className='rounded-md border border-border bg-card p-6'>
      <DashboardHeaderUi
        title={t('dashboard-api.title')}
        description={t('dashboard-api.description')}
        selectedValue={selectedValue}
        options={options}
        onSelect={onSelect}
      />
      <DashboardApiChartUi data={chartData} isLoading={isLoading} />
    </div>
  );
};

export default DashboardApiContainer;
