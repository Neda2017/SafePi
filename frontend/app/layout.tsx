export const metadata = { title: 'SafePi', description: 'SafePi app in Pi Browser' };
export default function RootLayout({ children }: any) {
  return (<html lang="en"><body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>{children}</body></html>);
}