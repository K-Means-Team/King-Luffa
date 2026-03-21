/**
 * WeChat / Luffa JSBridge utilities
 */

/**
 * Preview images natively using WeixinJSBridge
 * @param {string[]} urls - Array of image URLs to preview
 * @param {string} [current] - The URL that should be displayed first. Defaults to the first URL in `urls`.
 * @returns {Promise<any>}
 */
export function previewImage(urls, current = urls[0]) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof window.WeixinJSBridge === "undefined") {
      console.warn("WeixinJSBridge is not available");
      return reject(new Error("WeixinJSBridge is not available"));
    }

    try {
      window.WeixinJSBridge.invoke(
        "imagePreview",
        {
          current,
          urls,
        },
        function (res) {
          if (res.err_msg && res.err_msg.includes("ok")) {
            resolve(res);
          } else {
            resolve(res);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
