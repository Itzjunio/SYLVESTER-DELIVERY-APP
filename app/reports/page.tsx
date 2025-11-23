'use client';
import PageWrapper from '@/components/PageWrapper';
import ChartCard from '@/components/ChartCard';

export default function ReportsPage(){
  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales (last 7 days)" />
        <div className="card"><h3 className="text-lg font-medium mb-3">Top Restaurants</h3><ul className="space-y-2 small"><li>Pizza Palace — 240 orders</li><li>Burger House — 180 orders</li></ul></div>
      </div>
    </PageWrapper>
  );
}
