import { Color } from 'three';
import { CanvasTexture } from 'three';

/** List the default values of the lib components */
export default {
	container: null,
	fontFamily: null,
	fontSize: 0.05,
	fontKerning: 'normal', // FontKerning would act like css : "none"|"normal"|"auto"("auto" not yet implemented)
	bestFit: 'none',
	offset: 0.01,
	interLine: 0.01,
	breakOn: '- ,.:?!\n',// added '\n' to also acts as friendly breaks when white-space:normal
	whiteSpace: 'pre-line',
	contentDirection: 'column',
	alignContent: 'center',
	justifyContent: 'start',
	fontTexture: null,
	textType: 'MSDF',
	fontColor: new Color( 0xffffff ),
	fontOpacity: 1,
	fontPXRange: 4,
	fontSupersampling: true,
	borderRadius: 0.01,
	borderWidth: 0,
	borderColor: new Color( 'black' ),
	borderOpacity: 1,
	backgroundSize: "cover",
	backgroundColor: new Color( 0x222222 ),
	backgroundWhiteColor: new Color( 0xffffff ),
	backgroundOpacity: 0,
	backgroundOpaqueOpacity: 1.0,
	// this default value is a function to avoid initialization issues (see issue #126)
	backgroundTexture: makeBackgroundTexture,
	hiddenOverflow: false,
	letterSpacing: 0,
	padding: [0, 0, 0, 0],
	margin: [0, 0, 0, 0],
	isBloom: false,
	bloomWidth: 0.0,
	isInnerGlow: false
};

//
let defaultBgTexture;

function makeBackgroundTexture() {

	if ( !defaultBgTexture ) {

		const ctx = document.createElement( 'canvas' ).getContext( '2d' );
		ctx.canvas.width = 1;
		ctx.canvas.height = 1;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect( 0, 0, 1, 1 );
		defaultBgTexture = new CanvasTexture( ctx.canvas );
		defaultBgTexture.isDefault = true;

	}

	return defaultBgTexture;

}
