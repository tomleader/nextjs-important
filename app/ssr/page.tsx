import Image from 'next/image'
import Nav from '../component/nav'
import { headers } from 'next/headers';

export default function Page() {
  const now = new Date().toISOString();
  headers(); // 调用 headers()，告诉 Next.js 这个页面是动态的（每次请求重新渲染）

  return (
    <div>
      <Nav></Nav>
      <h1>SSR 页面</h1>
      <p>每次请求都会服务端重新渲染。</p>
      <p>生成时间: {now}</p>
    </div>
  );
}