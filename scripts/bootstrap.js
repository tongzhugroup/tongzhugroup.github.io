const css = hexo.extend.helper.get('css').bind(hexo);
const { version } = require("bootstrap/package.json");
const { npm_url } = require("jsdelivr_url");

hexo.extend.injector.register('head_end', () => {
	return css(npm_url('bootstrap', version, 'dist/css/bootstrap-grid.min.css'));
});
