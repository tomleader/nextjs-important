export const onRequest = (context) => {
  return new Response('Hello, edge functions! ' + JSON.stringify(context));
};