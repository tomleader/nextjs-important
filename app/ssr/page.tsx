

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
      const output = typeof result === 'string'
        ? result
        : JSON.stringify(result);
      results.push({ desc, output: output.slice(0, 120) });
    } catch (e: any) {
      results.push({ desc, output: 'Error: ' + e.message });
    }
  };

  // ------------------- 测试用例 --------------------

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

  await test('TCP 连接 example.com:80 (net)', () => {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = net.createConnection(80, 'example.com');
      socket.on('connect', () => {
        socket.end();
        resolve('连接成功');
      });
      socket.on('error', (e: Error) => {
        resolve('连接失败: ' + e.message);
      });
    });
  });

  await test('UDP socket 发送 (dgram)', () => {
    return new Promise((resolve) => {
      const dgram = require('dgram');
      const socket = dgram.createSocket('udp4');
      socket.send('ping', 41234, '127.0.0.1', (err: any) => {
        socket.close();
        resolve(err ? '发送失败: ' + err.message : '发送成功（本地）');
      });
    });
  });

  await test('GET 请求 example.com (https)', () => {
    return new Promise((resolve) => {
      const https = require('https');
      https.get('https://example.com', (res: any) => {
        resolve(`响应码: ${res.statusCode}`);
      }).on('error', (e: any) => {
        resolve('请求失败: ' + e.message);
      });
    });
  });

  await test('主机名 (os)', () => {
    const os = require('os');
    return os.hostname();
  });

  await test('vm.runInThisContext', () => {
    const vm = require('vm');
    return vm.runInThisContext('1 + 2');
  });

  await test('Module.createRequire', () => {
    const Module = require('module');
    const r = Module.createRequire(__filename);
    return typeof r('fs').readdirSync;
  });

  await test('process.cwd()', () => {
    return process.cwd();
  });

  await test('require.cache 删除', () => {
    delete require.cache[require.resolve('path')];
    return '已删除缓存';
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


