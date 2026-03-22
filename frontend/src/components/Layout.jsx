import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center">
        <main className="flex-1 w-full max-w-7xl px-8 py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
