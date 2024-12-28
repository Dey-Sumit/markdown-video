const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-[200px] w-[200px]">
      <div className="absolute -inset-x-10 h-px bg-gray-700" />
      <div className="absolute -inset-y-10 w-px bg-gray-700" />
      <div className="absolute -inset-x-10 top-full h-px bg-gray-700" />
      <div className="absolute -inset-y-10 left-full w-px bg-gray-700" />

      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
