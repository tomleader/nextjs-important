
import Link from 'next/link'

export default function Nav() {
  return (
    <div className="nav">
      <Link href="./">首页</Link>
      <Link href="./ssr">SSR 页面</Link>
      <Link href="./ssg">SSG 页面</Link>
      <Link href="./isr">ISR 页面</Link>
      <Link href="./functions">Functions 页面</Link>
    </div>
    )
}