#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform float r;
uniform float g;
uniform float b;
uniform float lightradius;
uniform float lightintensity;
uniform float lightalpha;
uniform float speed;

#ifdef GL_ES
precision mediump float;
#endif


#define iterations 17
#define formuparam 0.445302

#define volsteps 10
#define stepsize 0.260

#define zoom   0.8000
#define tile   0.20
#define speed  0.02200

#define brightness 0.0015
#define darkmatter 0.800
#define distfading 0.460
#define saturation 0.800
void main(void) {
	vec2 uv=gl_FragCoord.xy/resolution.xy-.5;
	uv.y*=resolution.y/resolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	
	float a2=time/10.0*speed;
	float a1=10.0;
	mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2=rot1;
	dir.xz*=rot1;
	dir.xy*=rot2;
	
	vec3 from=vec3(0.,0.,0.);
	from+=vec3(.001*time,.001*time,-2.);
	
	from.xz*=rot1;
	from.xy*=rot2;
	
	float s=.4,fade=.2;
	vec3 v=vec3(0.4);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.)));
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-1.1*formuparam;
			a+=abs(length(p)-pa);
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001);
		a*=a*a*2.;
		if (r>3) fade*=1.-dm;
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade;
		fade*=distfading;
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation);
	gl_FragColor = vec4(v*.01,1.);	

}
