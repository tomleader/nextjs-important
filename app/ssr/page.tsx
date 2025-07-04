

import Image from 'next/image'
import Nav from '../component/nav'
import { headers } from 'next/headers';

export default async function Page() {
  const now = new Date().toISOString();
  headers(); // 调用 headers()，告诉 Next.js 这个页面是动态的（每次请求重新渲染）

  const results = [];

  const test = async (desc, fn) => {
    try {
      const result = await fn();
      const output =
        typeof result === 'string'
          ? result
          : JSON.stringify(result, null, 2);
      results.push({ desc, output: output.slice(0, 100) });
    } catch (e) {
      results.push({ desc, output: 'Error: ' + e.message });
    }
  };

  await test('读取根目录 (fs)', () => {
    const fs = require('fs');
    return fs.readdirSync('/').join(', ');
  });

  await test('读取文件列表 (fs/promises)', async () => {
    const fsp = require('fs/promises');
    const files = await fsp.readdir('/');
    return files.join(', ');
  });

  await test('执行 shell 命令 (child_process)', () => {
    const cp = require('child_process');
    return cp.execSync('echo hello').toString();
  });

  await test('创建 TCP 连接 (net)', () => {
    const net = require('net');
    net.createConnection({ port: 80, host: 'example.com' });
    return 'net.createConnection created';
  });

  await test('创建 UDP socket (dgram)', () => {
    const dgram = require('dgram');
    dgram.createSocket('udp4');
    return 'dgram socket created';
  });

  await test('获取主机名 (os)', () => {
    const os = require('os');
    return os.hostname();
  });

  await test('检查是否 tty (tty)', () => {
    const tty = require('tty');
    return typeof tty.isatty;
  });

  await test('使用 Module.createRequire', () => {
    const Module = require('module');
    const r = Module.createRequire(__filename);
    return typeof r('fs').readdirSync;
  });

  await test('vm.runInThisContext', () => {
    const vm = require('vm');
    return vm.runInThisContext('1 + 2');
  });

  await test('process.cwd()', () => {
    return process.cwd();
  });

  await test('修改 require.cache', () => {
    delete require.cache[require.resolve('path')];
    return 'cache deleted';
  });

  return (
    <div>
      <Nav></Nav>
      <h1>SSR 页面</h1>
      <p>每次请求都会服务端重新渲染。</p>
      <p>生成时间: {now}</p>

      <div style={{ padding: '2em', fontFamily: 'sans-serif' }}>
      <h2>沙箱可访问模块输出检查</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>测试项</th>
            <th>输出或错误</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.desc}</td>
              <td><pre style={{ margin: 0 }}>{r.output}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      
    </div>

  );
}


