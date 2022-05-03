export default /* glsl */`

// float edgeDist = getEdgeDist();
vec2 edgeDist2 = getEdgeDist2();
float change = fwidth( edgeDist2.x );

float alpha = smoothstep( change, 0.0, edgeDist2.x );
diffuseColor *= edgeDist2.x;

vec4 borderColor = vec4( borderColor, borderOpacity * edgeDist2.x );
diffuseColor = mix( diffuseColor, borderColor, edgeDist2.y );


`
