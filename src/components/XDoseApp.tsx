
import { Layout } from './Layout';

interface XDoseAppProps {
  children: React.ReactNode;
}

export function XDoseApp({ children }: XDoseAppProps) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
