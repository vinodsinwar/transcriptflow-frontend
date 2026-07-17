// Redirect the *.pages.dev preview host to the canonical domain so Google
// never indexes the duplicate site. All other requests pass through.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.endsWith('.pages.dev')) {
    url.hostname = 'transcriptflow.io';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
