export default /* glsl */`

// borders sequences are : x:TOP, y:RIGHT, z:BOTTOM, w:LEFT
uniform vec4 borderWidth;
uniform vec3 borderColor;
uniform float borderOpacity;
uniform vec4 borderRadius;

uniform vec2 cornerTL;
uniform vec2 cornerTR;
uniform vec2 cornerBR;
uniform vec2 cornerBL;

varying vec2 vUvB;

// Borders
vec2 getEdgeDist2() {

	if( vUvB.x < cornerTL.x && vUvB.y > cornerTL.y ) {

		float dx = vUvB.x - cornerTL.x;
		float dy = vUvB.y - cornerTL.y;
		float d2 =  dx * dx + dy * dy;

		float r2 = borderRadius.x * borderRadius.x;

		float alpha = d2 > r2 ? 0.0 : 1.0;

		// paint border top

			// center x offset
			dx = vUvB.x - (cornerTL.x + borderWidth.w);
			dy = vUvB.y - (cornerTL.y - borderWidth.x);

			d2 = dx * dx + dy * dy;

			float border = d2 < r2 ? 0.0 : 1.0;


			return vec2( alpha, border );

	}

	if( vUvB.x > cornerTR.x && vUvB.y > cornerTR.y ) {

		float dx = cornerTR.x - vUvB.x;
		float dy = cornerTR.y - vUvB.y;
		float d2 =  dx * dx + dy * dy;

		float r2 = borderRadius.y * borderRadius.y;

		float alpha = d2 > r2 ? 0.0 : 1.0;

		// paint border top

			// center x offset
			dx -= borderWidth.y;
			dy -= borderWidth.x;

			d2 = dx * dx + dy * dy;

			float border = d2 < r2 ? 0.0 : 1.0;

						return vec2( alpha, border );

	}

	if( vUvB.x > cornerBR.x && vUvB.y < cornerBR.y ) {

		float dx = vUvB.x - cornerBR.x;
		float dy = vUvB.y - cornerBR.y;
		float d2 =  dx * dx + dy * dy;

		float r2 = borderRadius.z * borderRadius.z;

		float alpha = d2 > r2 ? 0.0 : 1.0;

		// paint border bottom right

			// center x offset
			dx = vUvB.x - (cornerTL.x - borderWidth.y);
			dy = vUvB.y - (cornerTL.y + borderWidth.z);

			d2 = dx * dx + dy * dy;

			float border = d2 > r2 ? 0.0 : 1.0;

						return vec2( alpha, border );
	}

	if( vUvB.x < cornerBL.x && vUvB.y < cornerBL.y ) {

		float dx = vUvB.x - cornerBL.x;
		float dy = vUvB.y - cornerBL.y;
		float d2 =  dx * dx + dy * dy;

		float r2 = borderRadius.w * borderRadius.w;
		float alpha = d2 > r2 ? 0.0 : 1.0;

		// center x offset
			dx = vUvB.x - (cornerTL.x + borderWidth.w);
			dy = vUvB.y - (cornerTL.y + borderWidth.z);

			d2 = dx * dx + dy * dy;

			float border = d2 > r2 ? 0.0 : 1.0;

			return vec2( alpha, border );
	}

	return vec2( 1.0, 0.0 );



}

`
