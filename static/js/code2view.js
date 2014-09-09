
define( 'code2view', function( require, exports, module ) {
	

	function code2View() {

		var htmlReplace = function( str ) {
			
			var tab = null, first = str.split(/\n/)[0], expr = /^(\t*)[.]*/.exec(first);

			if( expr ) {
				tab = expr[1];
			}

			// 替换多余的制表符
			if( tab !== null ) {

				var temp = [], lines = str.split(/\n/);

				for( var i = 0; i < lines.length; i ++ ) {
					var line = lines[i];

					temp.push( 
						line.replace( tab, '' )
					);
				}

				str = temp.join('\n');
			}

			return str.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
		};

		// 输出节点
		var write = {

			html: function(code, txt) {
				// View
				$(code).before('<p class="code-title">Html</p><pre class="code-html">'+ htmlReplace( txt ) +'</pre>');

				$(code).after(txt);
			},

			js: function(code, txt) {
				// View
				$(code).before('<p class="code-title">Javascript</p><pre class="code-js">'+ htmlReplace( txt ) +'</pre>');

				$(code).after( '<script>' + txt + '</scr'+'ipt>' );
			}
		};

		// 获取代码
		var getCode = function() {
			
			var coder = this, $datas = $(this).find( 'textarea' );

			$datas.each(function() { 
				var k = $(this).attr("type"), txt = $(this).val();

				write[k].call(this, coder, txt);
			}).hide();
		};

		$('code').each( getCode );
	}


	module.exports = code2View;

});