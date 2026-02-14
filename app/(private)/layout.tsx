import PrivateHeader from '@/components/layouts/PrivateHeader';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrivateHeader />
      {children}
    </>
  );
}
