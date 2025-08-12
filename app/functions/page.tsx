
import Nav from '../component/nav'

async function getData() {

  let edgeMSg = '', nodeMsg = '', errMsg;

  await Promise.all([
    fetch('/api/edge').then(res => res.text()),
    fetch('/api/node').then(res => res.text())
  ])
  .then(([data1, data2]) => {
    edgeMSg = data1
    nodeMsg = data2
  })
  .catch(() => {
    errMsg = 'Error loading data'
  });

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