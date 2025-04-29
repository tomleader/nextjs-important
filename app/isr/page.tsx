import Image from 'next/image'
import Nav from '../component/nav'

async function getData() {
  const now = new Date().toISOString();
  return { now };
}

export const revalidate = 10; // 每 10 秒重新生成一次

export default async function ISRPage() {
  const data = await getData();

  return (
    <div>
      <Nav></Nav>
      <h1>ISR 页面</h1>
      <p>初次访问生成，10秒后有新请求才后台更新。</p>
      <p>生成时间: {data.now}</p>
    </div>
  );
}