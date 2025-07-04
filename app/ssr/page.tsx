

import Image from 'next/image'
import Nav from '../component/nav'
import { headers } from 'next/headers';

export default function Page() {
  const now = new Date().toISOString();
  headers(); // 调用 headers()，告诉 Next.js 这个页面是动态的（每次请求重新渲染）

  const results: { desc: string; status: 'PASS' | 'FAIL' }[] = [];

  const test = async (desc: string, fn: () => any | Promise<any>) => {
    try {
      await fn();
      results.push({ desc, status: 'FAIL' });
    } catch {
      results.push({ desc, status: 'PASS' });
    }
  };

  // 文件系统
  test('fs module should be blocked', () => {
    const fs = require('fs');
    fs.readdirSync('/');
  });
  test('fs/promises module should be blocked', async () => {
    const fsp = require('fs/promises');
    await fsp.readdir('/');
  });

  // 子进程
  test('child_process should be blocked', () => {
    const cp = require('child_process');
    cp.execSync('ls');
  });

  // 网络
  test('net module should be blocked', () => {
    const net = require('net');
    net.createConnection({ port: 80, host: 'example.com' });
  });
  test('dgram module should be blocked', () => {
    const dgram = require('dgram');
    dgram.createSocket('udp4');
  });

  // 系统信息
  test('os module should be blocked', () => {
    const os = require('os');
    os.hostname();
  });
  test('tty module should be blocked', () => {
    const tty = require('tty');
    tty.isatty(0);
  });

  // 多线程
  test('worker_threads should be blocked', () => {
    const wt = require('worker_threads');
  });
  test('cluster should be blocked', () => {
    const cluster = require('cluster');
  });

  // 模块系统绕过
  test('Module.createRequire should be blocked', () => {
    const Module = require('module');
    const r = Module.createRequire(__filename);
    r('fs');
  });

  // vm 逃逸
  test('vm.runInThisContext should be blocked', () => {
    const vm = require('vm');
    vm.runInThisContext('require("fs")');
  });

  // process
  test('process.cwd() should not be allowed', () => {
    process.cwd();
  });

  // 模块缓存修改
  test('Modifying require.cache should not be allowed', () => {
    require.cache[require.resolve('path')] = null;
  });

  return (
    <div>
      <Nav></Nav>
      <h1>SSR 页面</h1>
      <p>每次请求都会服务端重新渲染。</p>
      <p>生成时间: {now}</p>

      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Node.js 沙箱安全测试结果</h2>
        <table border="1" cellpadding="8" cellspacing="0">
          <thead>
            <tr>
              <th>测试项</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            ${results.map(r => `
              <tr>
                <td>${r.desc}</td>
                <td style="color:${r.status === 'PASS' ? 'green' : 'red'}">${r.status}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

  );
}


