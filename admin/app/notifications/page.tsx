'use client';
import PageWrapper from '@/components/PageWrapper';

const notes = ['New order placed by James Lee','Sarah left a review','System maintenance tomorrow 2AM'];

export default function NotificationsPage(){
  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <ul className="space-y-3">{notes.map((n,i)=>(<li key={i} className="p-4 bg-white rounded-2xl shadow small">{n}</li>))}</ul>
    </PageWrapper>
  );
}
