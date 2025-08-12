

import Image from 'next/image'
import Nav from '../component/nav'
import { headers } from 'next/headers';

export default async function Page() {

  const now = new Date().toISOString();
  headers(); // 调用 headers()，告诉 Next.js 这个页面是动态的（每次请求重新渲染）
  
  type Result = { desc: string; output: string; explain: string };
  const results: Result[] = [];

  const test = async (desc: string, fn: () => any | Promise<any>, explain: string) => {
    try {
      const result = await fn();
      const output = typeof result === 'string' ? result : JSON.stringify(result);
      results.push({ desc, output: output.slice(0, 400), explain });
    } catch (e: any) {
      results.push({ desc, output: 'Error: ' + e.message, explain });
    }
  };

  // ================== 测试用例 ==================

  // 1. 文件系统相关 - 判断能否访问宿主文件
  await test(
    '读取根目录 (fs)',
    () => {
      const fs = require('fs');
      return fs.readdirSync('/').join(', ');
    },
    '检测文件系统访问权限，攻击者可能通过读取敏感文件收集信息。'
  );

  await test(
    '读取 /proc/self/cmdline',
    () => {
      const fs = require('fs');
      return fs.readFileSync('/proc/self/cmdline').toString();
    },
    '检测容器进程信息，判断宿主环境及逃逸路径。'
  );

  // 2. 子进程执行相关
  await test(
    '执行简单命令 (child_process.execSync)',
    () => {
      const cp = require('child_process');
      return cp.execSync('echo hello').toString();
    },
    '检测是否能执行系统命令，攻击者可能执行任意命令。'
  );

  // 3. 网络相关 - TCP连接和监听测试
  await test(
    '发起 TCP 连接 example.com:80 (net)',
    () =>
      new Promise((resolve) => {
        const net = require('net');
        const socket = net.createConnection(80, 'example.com');
        socket.on('connect', () => {
          socket.end();
          resolve('连接成功');
        });
        socket.on('error', (e: Error) => {
          resolve('连接失败: ' + e.message);
        });
      }),
    '检测是否允许出站 TCP 连接，攻击者可用作外部通信或数据泄露。'
  );

  await test(
    '尝试监听本地端口 (net.createServer)',
    () =>
      new Promise((resolve) => {
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
      }),
    '检测是否允许监听端口，监听一般在函数沙箱中被禁止，防止端口冲突及逃逸。'
  );

  // 4. UDP socket 发送测试
  await test(
    'UDP socket 本地发送 (dgram)',
    () =>
      new Promise((resolve) => {
        const dgram = require('dgram');
        const socket = dgram.createSocket('udp4');
        socket.send('ping', 41234, '127.0.0.1', (err: any) => {
          socket.close();
          resolve(err ? '发送失败: ' + err.message : '发送成功');
        });
      }),
    '测试是否能发UDP包，攻击者可能利用UDP进行DDoS或数据外泄。'
  );

  // 6. 环境变量泄露测试
  await test(
    '读取环境变量',
    () => Object.entries(process.env).slice(0, 15).map(([k, v]) => `${k}=${v}`).join('\n'),
    '检测是否暴露敏感环境变量，防止凭证泄露。'
  );

  // 8. Module.createRequire 绕过检测
  await test(
    'Module.createRequire 动态加载模块',
    () => {
      const Module = require('module');
      const r = Module.createRequire(__filename);
      return typeof r('fs').readFileSync;
    },
    '检测是否能绕过静态分析引入模块，增加攻击面。'
  );

  // 9. 容器信息探测
  await test(
    '获取主机名 (os.hostname)',
    () => {
      const os = require('os');
      return os.hostname();
    },
    '探测宿主环境，收集信息。'
  );


  return (
    <div>
      <Nav></Nav>
      <h1>SSR 页面</h1>
      <p>每次请求都会服务端重新渲染。</p>
      <p>生成时间: {now}</p>

      <div style={{ padding: '2em', fontFamily: 'sans-serif' }}>
      <h2>沙箱可访问模块输出检查</h2>
      <table>
          <thead>
            <tr>
              <th>测试项</th>
              <th>测试结果</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ desc, output, explain }, i) => (
              <tr key={i}>
                <td>{desc}</td>
                <td><pre>{output}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
      
    </div>

  );
}


