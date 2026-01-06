import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NebulaFogBackground = ({ intensity = 1.0, className = "fixed inset-0" }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        let animationFrameId;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        // Use container dimensions if not fixed
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;

        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uIntensity: { value: intensity },
            uMouse: { value: new THREE.Vector2(0, 0) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uIntensity;
        uniform vec2 uMouse;
        varying vec2 vUv;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }
        float noise(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            float n = p.x + p.y * 57.0 + 113.0 * p.z;
            return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                           mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                       mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                           mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
        }

        float fbm(vec3 p) {
            float f = 0.0;
            float amp = 0.5;
            for(int i = 0; i < 5; i++) {
                f += amp * noise(p);
                p *= 2.0;
                amp *= 0.5;
            }
            return f;
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
            
            // Mouse Interaction
            vec2 mouse = (uMouse.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
            float dist = length(uv - mouse);
            float interaction = smoothstep(0.5, 0.0, dist);
            
            // Distort UV based on mouse
            uv -= (uv - mouse) * interaction * 0.15;

            uv *= 4.5; 

            float r = length(uv); 
            float a = atan(uv.y, uv.x); 
            float rotation = uTime * 0.1; 
            
            // Add extra swirl from mouse
            rotation += interaction * 0.5;
            
            float spiral = a + 2.0 * r - rotation * 2.0; 
            float z = uTime * 0.1 + 1.0 / (r + 0.1);
            vec3 coord = vec3(r * 3.0 + cos(spiral)*0.5, spiral * 2.0, z);
            
            float nebula = fbm(coord);
            nebula = fbm(coord + vec3(nebula * 2.5, nebula * 2.5, 0.0));

            float core = 1.0 / (r * r * 20.0 + 0.6); 
            float ringMask = smoothstep(0.0, 0.6, r); 
            float intensity = nebula * ringMask * 1.8; 
            intensity += core * 0.6;
            
            // Highlight mouse area
            intensity += interaction * 0.3;
            
            vec3 black = vec3(0.05, 0.0, 0.1); // Dark Purple base instead of black
            vec3 deepPurple = vec3(0.2, 0.0, 0.4); 
            vec3 brightPurple = vec3(0.6, 0.1, 1.0);
            vec3 coreWhite = vec3(0.95, 0.9, 1.0);
            
            vec3 col = mix(black, deepPurple, smoothstep(0.0, 0.4, intensity));
            col = mix(col, brightPurple, smoothstep(0.4, 0.8, intensity));
            col = mix(col, coreWhite, smoothstep(0.9, 1.4, intensity));

            float vig = smoothstep(2.5, 0.5, r);
            col *= vig * uIntensity; 
            
            // Add a subtle ambient purple glow
            col += vec3(0.05, 0.0, 0.1);

            gl_FragColor = vec4(col, 1.0);
        }
      `,
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(plane);

        const animate = (time) => {
            uniforms.uTime.value = time * 0.001;
            uniforms.uIntensity.value = intensity; // Update intensity real-time
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        const handleResize = () => {
            const width = mount.clientWidth || window.innerWidth;
            const height = mount.clientHeight || window.innerHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };

        const handleMouseMove = (e) => {
            // Update mouse uniform (flip Y for shader coords)
            uniforms.uMouse.value.set(e.clientX, window.innerHeight - e.clientY);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            mount.removeChild(renderer.domElement);
            material.dispose();
            renderer.dispose();
        };
    }, [intensity]);

    return <div ref={mountRef} className={`z-0 pointer-events-none bg-[#050505] ${className}`} />;
};

export default NebulaFogBackground;
