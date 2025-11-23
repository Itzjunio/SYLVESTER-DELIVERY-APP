'use client';
import PageWrapper from '@/components/PageWrapper';
import Table from '@/components/Table';

const payments = [
  [501,'Sarah Wilson','$45.00','Card','Success'],
  [502,'James Lee','$28.00','Cash','Pending']
];

export default function PaymentsPage(){
  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold">Payments</h1>
      <Table columns={['Payment ID','Customer','Amount','Method','Status']} data={payments} />
    </PageWrapper>
  );
}
