import { NavBar } from './components/navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-black">
      <NavBar />
      <main className="w-full flex-1 pt-12">{children}</main>
    </div>
  );
}
