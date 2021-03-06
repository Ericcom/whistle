var Transform = require('pipestream').Transform;
var util = require('../util');

module.exports = function(req, res, next) {
	if (req.rules.weinre) {
		var localUIHost = this.config.localUIHost;
		util.disableReqCache(req.headers);
		res.on('src', function(_res) {
			if (!util.supportHtmlTransform(_res)) {
				return;
			}
			util.disableCSP(_res.headers);
			var name = util.getPath(util.rule.getMatcher(req.rules.weinre));
			var transform = new Transform();
			transform._transform = function(chunk, encoding, callback) {
				if (!chunk) {
					chunk = new Buffer('\r\n<script src="' + (req.isHttps ? 'https:' : 'http:') + '//weinre.' + localUIHost + '/target/target-script-min.js#'
							+ (name || 'anonymous') + '"></script>\r\n');
				}
				callback(null, chunk);
			};
			
			res.addZipTransform(transform, false, true);
		
		});
	}
	
	next();
};