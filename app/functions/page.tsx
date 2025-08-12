
import Nav from '../component/nav'

async function getData() {

  let edgeMSg = '', nodeMsg = '';

  await Promise.all([
    fetch('/api/edge').then(res => res),
    fetch('/api/node').then(res => res)
  ])
  .then(([data1, data2]) => {
    edgeMSg = data1
    nodeMsg = data2
  })
  .catch(() => {
    console.log('Error loading data')
  });

  return { edgeMSg, nodeMsg }
}

export default async function FunctionPage() {
  const data = await getData();

  return (
    <div>
      <Nav></Nav>
      <h1>Functions 页面</h1>
      <p>Edge 函数请求：</p>
      <p>{data.edgeMSg}</p>
      <p>Node 函数请求：</p>
      <p>{data.nodeMsg}</p>
    </div>
  );
}