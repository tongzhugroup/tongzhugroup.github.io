const css = hexo.extend.helper.get('css').bind(hexo);
const { version } = require("bootstrap/package.json");

function cdn_url(name, version, path){
	return `https://cdn.jsdelivr.net/npm/${name}@${version}/${path}`;
}

hexo.extend.injector.register('head_end', () => {
	return css(cdn_url('bootstrap', version, 'dist/css/bootstrap-grid.min.css'));
});
