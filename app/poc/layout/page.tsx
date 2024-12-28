import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-max">
      <div className="absolute -inset-x-10 h-px bg-gray-700" />
      <div className="absolute -inset-y-10 w-px bg-gray-700" />
      <div className="absolute -inset-x-10 top-full h-px bg-gray-700" />
      <div className="absolute -inset-y-10 left-full w-px bg-gray-700" />

      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
const page = () => {
  return (
    <section className="min-h-screen bg-gray-50 p-10">
      <Layout>
        <div className="min-h-96 p-2 text-black">HELLO</div>
      </Layout>
    </section>
  );
};

export default page;
