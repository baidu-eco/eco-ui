
define( 'code2view', function( require, exports, module ) {

	var htmlFormat = function( str ) {
			
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
			$(code).before('<p class="code-title">Html</p><pre class="code-html">'+ htmlFormat( txt ) +'</pre>');

			$(code).after(txt);
		},

		js: function(code, txt) {
			// View
			$(code).before('<p class="code-title">Javascript</p><pre class="code-js">'+ htmlFormat( txt ) +'</pre>');

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
	

	function code2View( arg ) {

		var arr = [];

		// { k: v }
		if( $.isPlainObject( arg ) ) {
			arr.push( arg );
		}
		// [{}, {}, ...]
		else if( $.isArray( arg ) ) {
			arr = arg;
		}
		else {
			throw( 'params error.' );
		}

		if( !arr.length ) {
			return;
		}

		for( var i = 0; i < arr.length; i++ ) {
			
			var method = arr[i];

			for( var n in method ) {
				
				if( window[n] === undefined ) {
					window[n] = method[n];
				}
			}
		}

		$('code').each( getCode );
	}


	module.exports = code2View;

});