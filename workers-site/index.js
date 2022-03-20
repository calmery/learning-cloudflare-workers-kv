import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  const { searchParams } = new URL(event.request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("", { status: 403 });
  }

  try {
    return await getAssetFromKV(event);
  } catch (error) {
    if (error instanceof MethodNotAllowedError) {
      return new Response("", { status: 405 });
    }

    if (error instanceof NotFoundError) {
      return new Response("", { status: 404 });
    }

    return new Response("", { status: 500 });
  }
}
