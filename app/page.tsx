
import Image from 'next/image'
import Nav from './component/nav'

export default function Page() {
  const now = new Date().toISOString();
  return <div>
    <Nav></Nav>
    <h1>Next.js App Router 混合渲染 Demo</h1>
    <p>生成时间: {now}</p>
  </div>
}