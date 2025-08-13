
export default async function NotFound() {
  const now = new Date().toLocaleString();
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 — 页面未找到 1111</h1>
      <p>当前时间：{now}</p>
    </div>
  );
}