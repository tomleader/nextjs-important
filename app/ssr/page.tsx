

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
      results.push({ desc, output: output.slice(0, 200) });
    } catch (e: any) {
      results.push({ desc, output: 'Error: ' + e.message });
    }
  };

    // ✅ 原基础测试项
  await test('读取根目录 (fs)', () => {
    const fs = require('fs');
    return fs.readdirSync('/').join(', ');
  });

  await test('执行 echo 命令 (child_process)', () => {
    const cp = require('child_process');
    return cp.execSync('echo hello').toString();
  });

  await test('发起 HTTP 请求 (https)', () => {
    return new Promise((resolve) => {
      const https = require('https');
      https.get('https://example.com', res => {
        resolve(`响应码: ${res.statusCode}`);
      }).on('error', err => {
        resolve('请求失败: ' + err.message);
      });
    });
  });

  await test('获取主机名 (os.hostname)', () => {
    const os = require('os');
    return os.hostname();
  });

  await test('VM 动态执行 (vm)', () => {
    const vm = require('vm');
    return vm.runInNewContext('2 + 3');
  });

  // ⚠️ 沙箱边界测试项

  await test('尝试监听端口 (net)', () => {
    return new Promise((resolve) => {
      const net = require('net');
      const server = net.createServer();
      server.listen(3333);
      server.on('listening', () => {
        server.close();
        resolve('监听成功');
      });
      server.on('error', (e: Error) => {
        resolve('监听失败: ' + e.message);
      });
    });
  });

  await test('访问内网元数据服务 (169.254.169.254)', () => {
    return new Promise((resolve) => {
      const http = require('http');
      const req = http.get('http://169.254.169.254', res => {
        resolve('状态码: ' + res.statusCode);
      });
      req.on('error', err => {
        resolve('失败: ' + err.message);
      });
      req.setTimeout(1000, () => {
        req.destroy();
        resolve('超时');
      });
    });
  });

  await test('读取 /proc/self/cmdline', () => {
    const fs = require('fs');
    return fs.readFileSync('/proc/self/cmdline').toString();
  });

  await test('ENV 环境变量泄露', () => {
    return Object.keys(process.env).slice(0, 5).map(k => `${k}=${process.env[k]}`).join('\n');
  });

  await test('执行死循环子进程', () => {
    const cp = require('child_process');
    cp.spawn('node', ['-e', 'while(true){}']);
    return '尝试执行';
  });

  await test('动态 VM 调用 require', () => {
    const vm = require('vm');
    return vm.runInNewContext("require('os').platform()");
  });

  await test('创建 UDP socket 并发送', () => {
    return new Promise((resolve) => {
      const dgram = require('dgram');
      const socket = dgram.createSocket('udp4');
      socket.send('hi', 41234, '127.0.0.1', (err: any) => {
        socket.close();
        resolve(err ? '发送失败: ' + err.message : '发送成功');
      });
    });
  });

  await test('Module.createRequire 绕过 require', () => {
    const Module = require('module');
    const r = Module.createRequire(__filename);
    return typeof r('fs').readFileSync;
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


