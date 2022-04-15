'use strict';

const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );

// data in format [ JS file name => demo title in examples page ]
const pages = [
	[ 'api__align_items', '.alignItems' ],
	[ 'api__antialiasing', '.fontSuperSampling' ],
	[ 'api__background_size', '.backgroundSize' ],
	[ 'api__best_fit', '.bestFit' ],
	[ 'api__border', '.border-<sup>*</sup>' ],
	[ 'api__content_direction', '.contentDirection' ],
	[ 'api__font_kerning', '.fontKerning' ],
	[ 'api__hidden_overflow', '.hiddenOverflow' ],
	[ 'api__justify_content', '.justifyContent' ],
	[ 'api__letter_spacing', '.letterSpacing' ],
	[ 'api__manual_positioning', '.autoLayout' ],
	[ 'api__text_align', '.textAlign' ],
	[ 'api__whitespace', '.whiteSpace' ],
	[ 'tut__basic_setup', 'Basic setup' ],
	[ 'tut__preloaded_font', 'Preload fonts' ],
	[ 'tut__nested_blocks', 'Nested Blocks' ],
	[ 'tut__tutorial_result', 'Tutorial result' ],
	[ 'ex__interactive_button', 'Interactive Button' ],
	[ 'ex__msdf_text', 'Big Text' ],
	[ 'ex__inline_block', 'Inline Block' ],
	[ 'ex__onafterupdate', 'On after Update' ],
	[ 'ex__keyboard', 'Keyboard' ],
	[ 'dev__justification', 'Justification' ],
	[ 'dev__whitespace', 'WhiteSpace' ],
];

// create one config for each of the data set above
const pagesConfig = pages.map( ( page ) => {
	return new HtmlWebpackPlugin( {
		title: page[ 0 ],
		filename: page[ 0 ] + '.html',
		template: path.resolve( __dirname, `../examples/html/example_template.html` ),
		chunks: [ page[ 0 ], 'three-mesh-ui' ],
		inject: true
	} );
} );

function pageReducer( accu, page ) {
	return accu + `<li title="${page[ 0 ]}">${page[ 1 ]}</li>`;
}

// just add one config for the index page
const indexConfig = new HtmlWebpackPlugin( {
	// sort pages per purposes
	pages: {

		examples: pages.filter( p => p[ 0 ].indexOf( 'ex__' ) === 0 ).reduce( pageReducer, '' ),
		api: pages.filter( p => p[ 0 ].indexOf( 'api__' ) === 0 ).reduce( pageReducer, '' ),
		tutorials: pages.filter( p => p[ 0 ].indexOf( 'tut__' ) === 0 ).reduce( pageReducer, '' ),
		dev: pages.filter( p => p[ 0 ].indexOf( 'dev__' ) === 0 ).reduce( pageReducer, '' )

	},

	environment: {
		production: false,
		version: require('./../package.json').version,
	},

	filename: 'index.html',
	template: path.resolve( __dirname, `../examples/html/index.html` ),
	inject: false
} );

pagesConfig.push( indexConfig );

const webpackConfig = env => {

	const IN_PRODUCTION = env.NODE_ENV === 'prod';

	const config = {
		mode: 'development',
		devtool: 'eval-source-map',

		entry: {
			'../dist/three-mesh-ui': './src/three-mesh-ui.js',
			api__align_items: './examples/api__align_items.js',
			api__antialiasing: './examples/api__antialiasing.js',
			api__background_size: './examples/api__background_size.js',
			api__best_fit: './examples/api__best_fit.js',
			api__border: './examples/api__border.js',
			api__content_direction: './examples/api__content_direction.js',
			api__font_kerning: './examples/api__font_kerning.js',
			api__hidden_overflow: './examples/api__hidden_overflow.js',
			api__justify_content: './examples/api__justify_content.js',
			api__letter_spacing: './examples/api__letter_spacing.js',
			api__manual_positioning: './examples/api__manual_positioning.js',
			api__text_align: './examples/api__text_align.js',
			api__whitespace: './examples/api__whitespace.js',
			tut__basic_setup: './examples/tut__basic_setup.js',
			tut__preloaded_font: './examples/tut__preloaded_font.js',
			tut__nested_blocks: './examples/tut__nested_blocks.js',
			tut__tutorial_result: './examples/tut__tutorial_result.js',
			ex__interactive_button: './examples/ex__interactive_button.js',
			ex__msdf_text: './examples/ex__msdf_text.js',
			ex__inline_block: './examples/ex__inline_block.js',
			ex__onafterupdate: './examples/ex__onafterupdate.js',
			ex__keyboard: './examples/ex__keyboard.js',
			dev__justification: './examples/dev__justification.js',
			dev__whitespace: './examples/dev__whitespace.js',

		},

		plugins: [
			new ESLintPlugin( { overrideConfigFile: './config/codestyle/.eslintrc', }),
			...pagesConfig
		],

		devServer: {
			hot: false,
			// The static directory of assets
			static: {
				directory: path.join( __dirname, 'dist' ),
				publicPath: '/'
			},

			// As eslint is ran during dev, only overlay errors and not warnings
			client: {
				overlay: {
					errors: true,
					warnings: false,
				},
			}

		},

		output: {
			filename: '[name].js',
			path: path.resolve( __dirname, '../dist' )
		},

		module: {

			rules: [

				{
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						'file-loader',
					],
				},

			],

		}

	};

	if ( IN_PRODUCTION ) {

		delete config.devtool;
		config.mode = 'production';

		indexConfig.userOptions.environment.production = true;

		config.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin( {
					test: /\.js(\?.*)?$/i,
					extractComments: 'some',
					terserOptions: {
						format: {
							comments: /@license/i,
						},
						compress: {
							drop_console: true,
						},
					}
				} ),
			],
		};
	}

	return config;
}

// share the configuration
module.exports = webpackConfig;
