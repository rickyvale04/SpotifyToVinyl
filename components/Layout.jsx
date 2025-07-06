import Sidebar from './main/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex h-full">
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
