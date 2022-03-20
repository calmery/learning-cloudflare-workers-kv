import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";

const handleEvent = async (event) => {
  const { request } = event;
  const { headers, url } = request;

  const id = new URL(url).searchParams.get("id");

  if (!id) {
    return new Response("No id provided", { status: 400 });
  }

  const allowedDomains = await REFERRER_KV.get(id);
  const referrer = headers.get("Referer");

  if (
    !allowedDomains ||
    (referrer &&
      !allowedDomains.split(/\s*,\s*/).includes(new URL(referrer).hostname))
  ) {
    return new Response("Access from not allowed", { status: 403 });
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

    // ToDo: エラーを記録する
    return new Response("", { status: 500 });
  }
};

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});
