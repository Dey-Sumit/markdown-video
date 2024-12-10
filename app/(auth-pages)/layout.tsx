export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center">
      {children}
    </div>
  );
}
