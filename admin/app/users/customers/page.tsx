'use client';
import PageWrapper from '@/components/PageWrapper';
import Table from '@/components/Table';
import { customers } from '@/lib/mock-data';

export default function CustomersPage(){
  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold">Customers</h1>
      <Table columns={['ID','Name','Email','Orders']} data={customers.map(c=>[c.id,c.name,c.email,c.orders])} />
    </PageWrapper>
  );
}
