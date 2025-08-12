export default function onRequest(context) {
  console.log('check context', context);
  return new Response('Hello node functions! ' + JSON.stringify(context));
}