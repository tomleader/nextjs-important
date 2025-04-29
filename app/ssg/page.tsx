import Image from 'next/image'
import Nav from '../component/nav'

export default function Page() {
  const now = new Date().toISOString();
  return (
    <div>
      <Nav></Nav>
      <h1>SSG 页面</h1>
      <p>构建时静态生成，不随请求变化。</p>
      <p>生成时间: {now}</p>
    </div>
  );

}