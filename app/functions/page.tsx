
"use client";

import { useEffect, useState } from 'react';
import Nav from '../component/nav';

async function getData() {
  let edgeMSg = '', nodeMsg = '';

  try {
    const [data1, data2] = await Promise.all([
      fetch('/api/edge').then(res => {
        if (!res.ok) throw new Error(`Edge request failed: ${res.status}`);
        return res.text(); 
      }),
      fetch('/api/node').then(res => {
        if (!res.ok) throw new Error(`Node request failed: ${res.status}`);
        return res.text(); 
      })
    ]);

    edgeMSg = data1;
    nodeMsg = data2;

  } catch (error) {
    console.error('Error loading data:', error);
  }

  return { edgeMSg, nodeMsg };
}

export default function FunctionPage() {
  const [data, setData] = useState<{ edgeMSg: string; nodeMsg: string }>({
    edgeMSg: '',
    nodeMsg: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 在组件加载时触发请求
    const loadData = async () => {
      const data = await getData();
      setData(data);  // 更新组件状态
      setLoading(false); // 请求完成，设置为非加载状态
    };

    loadData(); // 调用加载数据函数
  }, []);  // 空依赖数组确保只在组件挂载时执行一次

  return (
    <div>
      <Nav />
      {loading && (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <div>
          <h1>Functions 页面</h1>
          <p>Edge 函数请求：</p>
          <p>{data.edgeMSg || 'No data from Edge'}</p>
          <p>Node 函数请求：</p>
          <p>{data.nodeMsg || 'No data from Node'}</p>
        </div>
      )}
    </div>
  );
}