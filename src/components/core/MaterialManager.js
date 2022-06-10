/* eslint-disable camelcase */
//@TODO: Get rid of non camelcase uniforms

import {DoubleSide, ShaderMaterial, Vector2} from 'three';
import Defaults from '../../utils/Defaults.js';

/**

 Job:
 - Host the materials of a given component.
 - Update a component's materials clipping planes.
 - Update a material uniforms and such.

 Knows:
 - Its component materials.
 - Its component ancestors clipping planes.

 */
export default function MaterialManager(Base) {

    return class MaterialManager extends Base {

        constructor(options) {

            super(options);

            this.textUniforms = {
                u_texture: {value: null},
                u_color: {value: null},
                u_opacity: {value: null},
                u_pxRange: {value: null},
                u_useRGSS: {value: null},
            };

            this.backgroundUniforms = {
                u_texture: {value: null},
                u_color: {value: null},
                u_opacity: {value: null},
                u_backgroundMapping: {value: null},
                u_borderWidth: {value: null},
                u_borderColor: {value: null},
                u_borderRadiusTopLeft: {value: null},
                u_borderRadiusTopRight: {value: null},
                u_borderRadiusBottomRight: {value: null},
                u_borderRadiusBottomLeft: {value: null},
                u_borderOpacity: {value: null},
                u_size: {value: new Vector2(1, 1)},
                u_tSize: {value: new Vector2(1, 1)},
                u_isBloom: {value: null},
                u_bloomWidth: {value: null},
                u_isInnerGlow: {value: null}
            };

        }

        /**
         * Update backgroundMaterial uniforms.
         * Used within MaterialManager and in Block and InlineBlock innerUpdates.
         */
        updateBackgroundMaterial() {

            this.backgroundUniforms.u_texture.value = this.getBackgroundTexture();
            this.backgroundUniforms.u_isBloom.value = this.getIsBloom();
            this.backgroundUniforms.u_bloomWidth.value = this.getBloomWidth();
            this.backgroundUniforms.u_isInnerGlow.value = this.getIsInnerGlow();

            this.backgroundUniforms.u_tSize.value.set(
                this.backgroundUniforms.u_texture.value.image.width,
                this.backgroundUniforms.u_texture.value.image.height
            );

            if (this.size) this.backgroundUniforms.u_size.value.copy(this.size);

            if (this.backgroundUniforms.u_texture.value.isDefault) {

                this.backgroundUniforms.u_color.value = this.getBackgroundColor();

                this.backgroundUniforms.u_opacity.value = this.getBackgroundOpacity();

            } else {

                this.backgroundUniforms.u_color.value = this.backgroundColor || Defaults.backgroundWhiteColor;

                this.backgroundUniforms.u_opacity.value = (!this.backgroundOpacity && this.backgroundOpacity !== 0) ?
                    Defaults.backgroundOpaqueOpacity :
                    this.backgroundOpacity;

            }

            this.backgroundUniforms.u_backgroundMapping.value = (() => {

                switch (this.getBackgroundSize()) {

                    case 'stretch':
                        return 0;
                    case 'contain':
                        return 1;
                    case 'cover':
                        return 2;

                }

            })();

            const borderRadius = this.getBorderRadius();
            this.backgroundUniforms.u_borderWidth.value = this.getBorderWidth();
            this.backgroundUniforms.u_borderColor.value = this.getBorderColor();
            this.backgroundUniforms.u_borderOpacity.value = this.getBorderOpacity();

            //

            if (Array.isArray(borderRadius)) {

                this.backgroundUniforms.u_borderRadiusTopLeft.value = borderRadius[0];
                this.backgroundUniforms.u_borderRadiusTopRight.value = borderRadius[1];
                this.backgroundUniforms.u_borderRadiusBottomRight.value = borderRadius[2];
                this.backgroundUniforms.u_borderRadiusBottomLeft.value = borderRadius[3];

            } else {

                this.backgroundUniforms.u_borderRadiusTopLeft.value = borderRadius;
                this.backgroundUniforms.u_borderRadiusTopRight.value = borderRadius;
                this.backgroundUniforms.u_borderRadiusBottomRight.value = borderRadius;
                this.backgroundUniforms.u_borderRadiusBottomLeft.value = borderRadius;

            }

        }

        /**
         * Update backgroundMaterial uniforms.
         * Used within MaterialManager and in Text innerUpdates.
         */
        updateTextMaterial() {

            this.textUniforms.u_texture.value = this.getFontTexture();
            this.textUniforms.u_color.value = this.getFontColor();
            this.textUniforms.u_opacity.value = this.getFontOpacity();
            this.textUniforms.u_pxRange.value = this.getFontPXRange();
            this.textUniforms.u_useRGSS.value = this.getFontSupersampling();

        }

        /** Called by Block, which needs the background material to create a mesh */
        getBackgroundMaterial() {

            if (!this.backgroundMaterial || !this.backgroundUniforms) {

                this.backgroundMaterial = this._makeBackgroundMaterial();

            }

            return this.backgroundMaterial;

        }

        /** Called by Text to get the font material */
        getFontMaterial() {

            if (!this.fontMaterial || !this.textUniforms) {

                this.fontMaterial = this._makeTextMaterial();

            }

            return this.fontMaterial;

        }

        /** @private */
        _makeTextMaterial() {

            return new ShaderMaterial({
                uniforms: this.textUniforms,
                transparent: true,
                clipping: true,
                vertexShader: textVertex,
                fragmentShader: textFragment,
                extensions: {
                    derivatives: true
                }
            });

        }

        /** @private */
        _makeBackgroundMaterial() {

            return new ShaderMaterial({
                uniforms: this.backgroundUniforms,
                transparent: true,
                clipping: true,
                // side: DoubleSide,
                vertexShader: backgroundVertex,
                fragmentShader: backgroundFragment,
                extensions: {
                    derivatives: true
                }
            });

        }

        /**
         * Update a component's materials clipping planes.
         * Called every frame.
         */
        updateClippingPlanes(value) {

            const newClippingPlanes = value !== undefined ? value : this.getClippingPlanes();

            if (JSON.stringify(newClippingPlanes) !== JSON.stringify(this.clippingPlanes)) {

                this.clippingPlanes = newClippingPlanes;

                if (this.fontMaterial) this.fontMaterial.clippingPlanes = this.clippingPlanes;

                if (this.backgroundMaterial) this.backgroundMaterial.clippingPlanes = this.clippingPlanes;

            }

        }

    };

}

////////////////
// Text shaders
////////////////

const textVertex = `
varying vec2 vUv;

#include <clipping_planes_pars_vertex>

void main() {

	vUv = uv;
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	gl_Position.z -= 0.00001;

	#include <clipping_planes_vertex>

}
`;

//

const textFragment = `

uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_opacity;
uniform float u_pxRange;
uniform bool u_useRGSS;

varying vec2 vUv;

#include <clipping_planes_pars_fragment>

// functions from the original msdf repo:
// https://github.com/Chlumsky/msdfgen#using-a-multi-channel-distance-field

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(u_pxRange)/vec2(textureSize(u_texture, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(vUv);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

float tap(vec2 offsetUV) {
	vec3 msd = texture( u_texture, offsetUV ).rgb;
	float sd = median(msd.r, msd.g, msd.b);
	float screenPxDistance = screenPxRange() * (sd - 0.5);
	float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	return alpha;
}

void main() {

	float alpha;

	if ( u_useRGSS ) {

		// shader-based supersampling based on https://bgolus.medium.com/sharper-mipmapping-using-shader-based-supersampling-ed7aadb47bec
		// per pixel partial derivatives
		vec2 dx = dFdx(vUv);
		vec2 dy = dFdy(vUv);

		// rotated grid uv offsets
		vec2 uvOffsets = vec2(0.125, 0.375);
		vec2 offsetUV = vec2(0.0, 0.0);

		// supersampled using 2x2 rotated grid
		alpha = 0.0;
		offsetUV.xy = vUv + uvOffsets.x * dx + uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.x * dx - uvOffsets.y * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv + uvOffsets.y * dx - uvOffsets.x * dy;
		alpha += tap(offsetUV);
		offsetUV.xy = vUv - uvOffsets.y * dx + uvOffsets.x * dy;
		alpha += tap(offsetUV);
		alpha *= 0.25;

	} else {

		alpha = tap( vUv );

	}


	// apply the opacity
	alpha *= u_opacity;

	// this is useful to avoid z-fighting when quads overlap because of kerning
	if ( alpha < 0.02) discard;


	gl_FragColor = vec4( u_color, alpha );

	#include <clipping_planes_fragment>

}
`;

//////////////////////
// Background shaders
//////////////////////

const backgroundVertex = `
varying vec2 vUv;

#include <clipping_planes_pars_vertex>

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	#include <clipping_planes_vertex>
}
`;

//

const backgroundFragment = `
uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_opacity;

uniform float u_borderRadiusTopLeft;
uniform float u_borderRadiusTopRight;
uniform float u_borderRadiusBottomLeft;
uniform float u_borderRadiusBottomRight;
uniform float u_borderWidth;
uniform vec3 u_borderColor;
uniform float u_borderOpacity;
uniform vec2 u_size;
uniform vec2 u_tSize;
uniform int u_backgroundMapping;
uniform bool u_isBloom;
uniform float u_bloomWidth;
uniform bool u_isInnerGlow;

varying vec2 vUv;

#include <clipping_planes_pars_fragment>

float getEdgeDist() {
	vec2 ndc = vec2( vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0 );
	vec2 planeSpaceCoord = vec2( u_size.x * 0.5 * ndc.x, u_size.y * 0.5 * ndc.y );
	vec2 corner = u_size * 0.5;
	vec2 offsetCorner = corner - abs( planeSpaceCoord );
	float innerRadDist = min( offsetCorner.x, offsetCorner.y ) * -1.0;
	if (vUv.x < 0.5 && vUv.y >= 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusTopLeft, 0.0 ) ) - u_borderRadiusTopLeft;
		float s = step( innerRadDist * -1.0, u_borderRadiusTopLeft );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x >= 0.5 && vUv.y >= 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusTopRight, 0.0 ) ) - u_borderRadiusTopRight;
		float s = step( innerRadDist * -1.0, u_borderRadiusTopRight );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x >= 0.5 && vUv.y < 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusBottomRight, 0.0 ) ) - u_borderRadiusBottomRight;
		float s = step( innerRadDist * -1.0, u_borderRadiusBottomRight );
		return mix( innerRadDist, roundedDist, s );
	}
	if (vUv.x < 0.5 && vUv.y < 0.5) {
		float roundedDist = length( max( abs( planeSpaceCoord ) - u_size * 0.5 + u_borderRadiusBottomLeft, 0.0 ) ) - u_borderRadiusBottomLeft;
		float s = step( innerRadDist * -1.0, u_borderRadiusBottomLeft );
		return mix( innerRadDist, roundedDist, s );
	}
}

vec2 calcNewUV() {
	float textureRatio = u_tSize.x / u_tSize.y;
	float panelRatio = u_size.x / u_size.y;
	vec2 uv = vUv;
	if ( u_backgroundMapping == 1 ) { // contain
		if ( textureRatio < panelRatio ) { // repeat on X
			float newX = uv.x * ( panelRatio / textureRatio );
			newX += 0.5 - 0.5 * ( panelRatio / textureRatio );
			uv.x = newX;
		} else { // repeat on Y
			float newY = uv.y * ( textureRatio / panelRatio );
			newY += 0.5 - 0.5 * ( textureRatio / panelRatio );
			uv.y = newY;
		}
	} else if ( u_backgroundMapping == 2 ) { // cover
		if ( textureRatio < panelRatio ) { // stretch on Y
			float newY = uv.y * ( textureRatio / panelRatio );
			newY += 0.5 - 0.5 * ( textureRatio / panelRatio );
			uv.y = newY;
		} else { // stretch on X
			float newX = uv.x * ( panelRatio / textureRatio );
			newX += 0.5 - 0.5 * ( panelRatio / textureRatio );
			uv.x = newX;
		}
	}
	
	return uv;
}

vec4 sampleTexture(vec2 uv) {
	return texture2D( u_texture, uv ).rgba;
}

void main() {
	float edgeDist = getEdgeDist();
	float change = fwidth( edgeDist );

	vec2 newUV = calcNewUV();
	vec4 textureSample = sampleTexture(newUV);
	vec3 blendedColor = textureSample.rgb * u_color;
	
	float alpha = smoothstep( change, 0.0, edgeDist );
	float blendedOpacity = u_opacity * textureSample.a * alpha;

	vec4 frameColor = vec4( blendedColor, blendedOpacity );
	if(frameColor.a == 0.0) discard;

	vec4 basicPixel = vec4(0);
	//Rendering border
    vec4 borderColor = vec4( u_borderColor, u_borderOpacity * alpha );
    
	if ( u_borderWidth <= 0.0 ) {
	    if(u_isBloom == true) {
            borderColor = vec4(borderColor.x, borderColor.y, borderColor.z, 0);
            float stp = smoothstep( 0.0, u_bloomWidth, edgeDist * -1.0 );
            vec4 rawPixel = mix( borderColor, frameColor, stp );
            basicPixel = vec4(rawPixel.x, rawPixel.y, rawPixel.z,  rawPixel.a);
        } else {
            basicPixel = frameColor;
        } 
	} else {	
		//Inner Glow, can be helpful!
		if( u_isInnerGlow == true ) {
		    float stp = smoothstep( change, edgeDist, u_borderWidth * -1.0 );
		    basicPixel = mix( frameColor, borderColor, stp );
		} else {        
            float stp = smoothstep( edgeDist + change, edgeDist, u_borderWidth * -1.0 );
            basicPixel = mix( frameColor, borderColor, stp );
        }
	}
    gl_FragColor = basicPixel;
	
	
	#include <clipping_planes_fragment>
}
`;
