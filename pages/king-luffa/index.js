/**
 * SuperBox entry page: full-screen web-view loads packaged H5 from /script/index.html (see app.json staticPath).
 */

Page({
  onWebViewLoad(e) {
    console.log("King Luffa web-view load", e.detail);
  },
  onWebViewError(e) {
    console.error("King Luffa web-view error", e.detail);
  },
});
