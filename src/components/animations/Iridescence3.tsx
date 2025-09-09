'use client';

import { useEffect, useRef } from 'react';

interface IridescenceProps {
  colors?: [number, number, number][];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Iridescence({
  colors = [[1, 1, 1]],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className = '',
  ...rest
}: IridescenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.error('WebGL no disponible');
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform vec3 uResolution;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uSpeed;
      varying vec2 vUv;

      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
        uv += (uMouse - vec2(0.5)) * uAmplitude;
        float d = -uTime * 0.5 * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += uTime * 0.5 * uSpeed;

        // Crear patrones para los 4 colores
        vec3 baseColor = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);

        // Dividir la pantalla en 4 zonas para los colores
        float zone1 = sin(d + uv.x * 2.0) * 0.5 + 0.5;
        float zone2 = sin(a + uv.y * 2.0 + 1.57) * 0.5 + 0.5;
        float zone3 = sin(d * 0.8 + a * 1.2 + 3.14) * 0.5 + 0.5;
        float zone4 = sin(d * 1.2 + a * 0.8 + 4.71) * 0.5 + 0.5;

        // Normalizar las zonas
        float total = zone1 + zone2 + zone3 + zone4;
        zone1 /= total;
        zone2 /= total;
        zone3 /= total;
        zone4 /= total;

        // Aplicar la animación original a cada color
        vec3 col1 = cos(baseColor * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor1;
        vec3 col2 = cos(baseColor * cos(vec3(d + 1.0, a + 1.0, 2.5)) * 0.5 + 0.5) * uColor2;
        vec3 col3 = cos(baseColor * cos(vec3(d + 2.0, a + 2.0, 2.5)) * 0.5 + 0.5) * uColor3;
        vec3 col4 = cos(baseColor * cos(vec3(d + 3.0, a + 3.0, 2.5)) * 0.5 + 0.5) * uColor4;

        // Mezclar los colores
        vec3 finalColor = col1 * zone1 + col2 * zone2 + col3 * zone3 + col4 * zone4;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error enlazando programa:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Crear buffers para el triángulo
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
      gl.STATIC_DRAW
    );

    // Obtener ubicaciones de atributos y uniformes
    const positionLocation = gl.getAttribLocation(program, 'position');
    const uvLocation = gl.getAttribLocation(program, 'uv');
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const mouseLocation = gl.getUniformLocation(program, 'uMouse');
    const color1Location = gl.getUniformLocation(program, 'uColor1');
    const color2Location = gl.getUniformLocation(program, 'uColor2');
    const color3Location = gl.getUniformLocation(program, 'uColor3');
    const color4Location = gl.getUniformLocation(program, 'uColor4');
    const amplitudeLocation = gl.getUniformLocation(program, 'uAmplitude');
    const speedLocation = gl.getUniformLocation(program, 'uSpeed');

    // Configurar los colores
    const color1 = colors[0] || [1, 1, 1];
    const color2 = colors[1] || colors[0] || [1, 1, 1];
    const color3 = colors[2] || colors[1] || colors[0] || [1, 1, 1];
    const color4 = colors[3] || colors[2] || colors[1] || colors[0] || [1, 1, 1];

    function resize() {
      if (!container || !canvas || !gl) return;
      const rect = container.getBoundingClientRect();
      const displayWidth = rect.width;
      const displayHeight = rect.height;
      canvas.width = displayWidth * window.devicePixelRatio;
      canvas.height = displayHeight * window.devicePixelRatio;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const render = (time: number) => {
      if (!canvas || !gl) return;
      if (!canvas.width || !canvas.height) {
        resize();
      }
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      // Configurar atributos
      gl.enableVertexAttribArray(positionLocation);
      gl.enableVertexAttribArray(uvLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);

      // Configurar uniformes
      if (timeLocation) gl.uniform1f(timeLocation, time * 0.001);
      if (resolutionLocation) gl.uniform3f(resolutionLocation, canvas.width, canvas.height, 1);
      if (mouseLocation) gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
      if (color1Location) gl.uniform3f(color1Location, color1[0], color1[1], color1[2]);
      if (color2Location) gl.uniform3f(color2Location, color2[0], color2[1], color2[2]);
      if (color3Location) gl.uniform3f(color3Location, color3[0], color3[1], color3[2]);
      if (color4Location) gl.uniform3f(color4Location, color4[0], color4[1], color4[2]);
      if (amplitudeLocation) gl.uniform1f(amplitudeLocation, amplitude);
      if (speedLocation) gl.uniform1f(speedLocation, speed);

      // Dibujar
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationRef.current = requestAnimationFrame(render);
    };

    function handleMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
    }

    if (mouseReact) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      if (mouseReact && container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [colors, speed, amplitude, mouseReact]);

  return (
    <div
      ref={containerRef}
      className={`size-full ${className}`}
      style={{
        position: 'relative',
        minHeight: '100%',
        ...rest.style,
      }}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
