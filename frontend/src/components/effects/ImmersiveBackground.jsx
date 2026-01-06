import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ImmersiveBackground = ({ mode = 'home' }) => {
    const mountRef = useRef(null);

    // Configuration for different modes
    const config = {
        'home': {
            colors: [new THREE.Color('#000000'), new THREE.Color('#0a0a0a'), new THREE.Color('#1e1b4b')],
            speed: 0.2,
            scale: 1.0,
            intensity: 0.6
        },
        'Single Player': {
            colors: [new THREE.Color('#020617'), new THREE.Color('#052e16'), new THREE.Color('#16a34a')], // Balanced Green
            speed: 0.3,
            scale: 1.5,
            intensity: 0.8
        },
        'Competitive': {
            colors: [new THREE.Color('#1a0505'), new THREE.Color('#450a0a'), new THREE.Color('#dc2626')], // Balanced Red
            speed: 0.8,
            scale: 0.8,
            intensity: 0.75
        },
        'Card Games': {
            colors: [new THREE.Color('#0f0518'), new THREE.Color('#3b0764'), new THREE.Color('#9333ea')], // Balanced Purple
            speed: 0.1,
            scale: 1.2,
            intensity: 0.75
        },
        'Prediction': {
            colors: [new THREE.Color('#1c1917'), new THREE.Color('#422006'), new THREE.Color('#eab308')], // Balanced Gold
            speed: 0.15,
            scale: 2.0,
            intensity: 0.7
        },
        'Rankings': {
            colors: [new THREE.Color('#000000'), new THREE.Color('#271a0c'), new THREE.Color('#d97706')], // Deep Black to Rich Amber
            speed: 0.1,
            scale: 1.8,
            intensity: 0.85
        },
        'Profile': {
            colors: [new THREE.Color('#020617'), new THREE.Color('#0e7490'), new THREE.Color('#22d3ee')], // Deep Slate to Cyan
            speed: 0.05,
            scale: 1.5,
            intensity: 0.6
        },
        'Referral': {
            colors: [new THREE.Color('#1e1b4b'), new THREE.Color('#581c87'), new THREE.Color('#fbbf24')], // Deep Indigo to Purple to Gold
            speed: 0.08,
            scale: 1.6,
            intensity: 0.75
        }
    };

    useEffect(() => {
        const mount = mountRef.current;
        let animationFrameId;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        // Current State (for interpolation)
        const currentState = {
            color1: config['home'].colors[0].clone(),
            color2: config['home'].colors[1].clone(),
            color3: config['home'].colors[2].clone(),
            speed: config['home'].speed,
            scale: config['home'].scale,
            intensity: config['home'].intensity
        };

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1: { value: currentState.color1 },
            uColor2: { value: currentState.color2 },
            uColor3: { value: currentState.color3 },
            uSpeed: { value: currentState.speed },
            uScale: { value: currentState.scale },
            uIntensity: { value: currentState.intensity }
        };

        // Default Noise Shader (for Games/Home)
        const noiseFragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform vec3 uColor3;
            uniform float uSpeed;
            uniform float uScale;
            uniform float uIntensity;
            varying vec2 vUv;

            // Simplex Noise functions
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                uv.x *= uResolution.x / uResolution.y;
                
                float time = uTime * uSpeed;
                
                // Domain Warping
                vec2 q = vec2(0.);
                q.x = snoise(uv * uScale + time * 0.1);
                q.y = snoise(uv * uScale + time * 0.15);

                vec2 r = vec2(0.);
                r.x = snoise(uv * uScale + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
                r.y = snoise(uv * uScale + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);

                float f = snoise(uv * uScale + r);

                // Color Mixing
                vec3 color = mix(uColor1, uColor2, clamp((f*f)*4.0, 0.0, 1.0));
                color = mix(color, uColor3, clamp(length(q), 0.0, 1.0));
                
                // Vignette
                vec2 center = uv - vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
                float dist = length(center);
                float vignette = smoothstep(1.5, 0.5, dist);
                
                color = color * vignette * uIntensity;

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Grid/Data Shader (For Rankings)
        const gridFragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec3 uColor1; // Background
            uniform vec3 uColor2; // Grid Lines
            uniform vec3 uColor3; // Glow
            uniform float uSpeed;
            varying vec2 vUv;

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
                
                // 3D Projection
                vec3 ro = vec3(0.0, 1.0, uTime * uSpeed * 2.0); // Ray origin
                vec3 rd = normalize(vec3(uv.x, uv.y - 0.2, 1.0)); // Ray direction
                
                float t = -ro.y / rd.y; // Intersection with floor plane (y=0)
                
                vec3 col = uColor1; // Background color
                
                if (t > 0.0) {
                    vec3 pos = ro + t * rd;
                    
                    // Grid Logic
                    vec2 grid = abs(fract(pos.xz * 1.0) - 0.5) / fwidth(pos.xz * 1.0);
                    float line = min(grid.x, grid.y);
                    
                    // Fade out grid at distance
                    float fade = exp(-0.1 * t);
                    
                    // Grid Lines
                    float gridIntensity = 1.0 - smoothstep(0.0, 0.05, line);
                    col = mix(col, uColor2, gridIntensity * fade);
                    
                    // Moving glow pulses
                    float pulse = sin(pos.z * 0.5 - uTime * 2.0) * 0.5 + 0.5;
                    col += uColor3 * pulse * fade * 0.2;
                }
                
                // Sky Gradient
                float sky = smoothstep(0.0, 0.4, uv.y + 0.2);
                col = mix(col, uColor1 * 0.5, sky);

                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: (mode === 'Rankings' || mode === 'Profile' || mode === 'Referral') ? gridFragmentShader : noiseFragmentShader
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(plane);

        // Animation Loop
        const animate = (time) => {
            const t = time * 0.001;
            uniforms.uTime.value = t;

            // Interpolate towards target state
            const target = config[mode] || config['home'];
            const lerpFactor = 0.05; // Smooth transition speed

            currentState.color1.lerp(target.colors[0], lerpFactor);
            currentState.color2.lerp(target.colors[1], lerpFactor);
            currentState.color3.lerp(target.colors[2], lerpFactor);
            currentState.speed += (target.speed - currentState.speed) * lerpFactor;
            currentState.scale += (target.scale - currentState.scale) * lerpFactor;
            currentState.intensity += (target.intensity - currentState.intensity) * lerpFactor;

            uniforms.uColor1.value.copy(currentState.color1);
            uniforms.uColor2.value.copy(currentState.color2);
            uniforms.uColor3.value.copy(currentState.color3);
            uniforms.uSpeed.value = currentState.speed;
            uniforms.uScale.value = currentState.scale;
            uniforms.uIntensity.value = currentState.intensity;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            mount.removeChild(renderer.domElement);
            material.dispose();
            renderer.dispose();
        };
    }, [mode]); // Re-run effect if mode changes (though we handle interpolation inside loop, this ensures config updates if we hot-reload)

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none bg-[#050505]" />;
};

export default ImmersiveBackground;
