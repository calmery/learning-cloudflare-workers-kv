import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";

const handleEvent = async (event) => {
  const { request } = event;
  const { headers, url } = request;

  const id = new URL(url).searchParams.get("id");
  const referrer = headers.get("Referer");

  if (!id || !referrer) {
    return new Response("", { status: 403 });
  }

  const allowedDomains = await REFERRER_KV.get(id);

  if (
    !allowedDomains ||
    !allowedDomains.split(/\s*,\s*/).includes(new URL(referrer).hostname)
  ) {
    return new Response("Access not allowed", { status: 403 });
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
};

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});
