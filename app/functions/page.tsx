
import Nav from '../component/nav'

async function getData() {

  let edgeMSg = '', nodeMsg = '', errMsg;

  try {
    const [data1, data2] = await Promise.all([
      fetch('/api/edge').then(res => {
        if (!res.ok) throw new Error(`Edge request failed with status: ${res.status}`);
        return res.text();  
      }),
      fetch('/api/node').then(res => {
        if (!res.ok) throw new Error(`Node request failed with status: ${res.status}`);
        return res.text(); 
      })
    ]);

    edgeMSg = data1;
    nodeMsg = data2;

  } catch (error) {
    errMsg = JSON.stringify(error)
  }

  return { edgeMSg, nodeMsg, errMsg }
}

export default async function FunctionPage() {
  const data = await getData();

  return (
    <div>
      <Nav></Nav>
      <h1>Functions 页面</h1>
      <p>Edge 函数请求：</p>
      <p>{data.edgeMSg || data.errMsg}</p>
      <p>Node 函数请求：</p>
      <p>{data.nodeMsg || data.errMsg}</p>
    </div>
  );
}