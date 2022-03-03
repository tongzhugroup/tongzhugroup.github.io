const js = hexo.extend.helper.get('js').bind(hexo);
const crypto = require('crypto');
const { npm_url, gh_url } = require("jsdelivr_url");
const { name: next_name, version: next_version } = require("hexo-theme-next/package.json");
const { name: icon_name, version: icon_version } = require("@njzjz/icons/package.json");

hexo.on('generateBefore', function () {
  hexo.theme.config.images = npm_url(next_name, next_version, "source/images");
  if (process.env.CSS_COMMIT) {
    hexo.config.assets_prefix = gh_url("tongzhugroup", "tongzhugroup.github.io", process.env.CSS_COMMIT, "");
  }
  // icons
  const avatar_url = npm_url(icon_name, icon_version, "computchem/logo.jpg");
  hexo.theme.config.avatar.url = avatar_url;
  hexo.theme.config.favicon.small = avatar_url;
  hexo.theme.config.favicon.medium = avatar_url;
  hexo.theme.config.favicon.apple_touch_icon = avatar_url;
  hexo.theme.config.favicon.safari_pinned_tab = avatar_url;
  hexo.theme.config.icons = npm_url(icon_name, icon_version, "");
});

hexo.extend.filter.register('after_generate', () => {
  // remove all images
  hexo.route.list().filter(path => path.startsWith("images/")).forEach(path => {
    hexo.route.remove(path);
  });
});

hexo.extend.injector.register('body_end',
  js(gh_url("njzjz", "gist", "5eab1974597adee1a1f5de13cc8acd53c14d6ba1", "modernizr-custom.js"))
);
