import * as THREE from "three";

console.clear();

class Blob {
  constructor(renderer) {
    this.renderer = renderer;
    this.fbTexture = { value: new THREE.FramebufferTexture(innerWidth, innerHeight) };
    this.rtOutput = new THREE.WebGLRenderTarget(innerWidth, innerHeight);
    this.uniforms = {
      pointer: { value: new THREE.Vector2().setScalar(10) },
      pointerDown: { value: 1 },
      pointerRadius: { value: 1.0 },
      pointerDuration: { value: 2.5 }
    };

    window.addEventListener("pointermove", event => {
      this.uniforms.pointer.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.uniforms.pointer.value.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    renderer.domElement.addEventListener("pointerleave", () => {
      this.uniforms.pointer.value.setScalar(10);
    });

    this.rtScene = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        onBeforeCompile: shader => {
          shader.uniforms.dTime = gu.dTime;
          shader.uniforms.aspect = gu.aspect;
          shader.uniforms.pointer = this.uniforms.pointer;
          shader.uniforms.pointerDown = this.uniforms.pointerDown;
          shader.uniforms.pointerRadius = this.uniforms.pointerRadius;
          shader.uniforms.pointerDuration = this.uniforms.pointerDuration;
          shader.uniforms.fbTexture = this.fbTexture;
          shader.fragmentShader = `
            uniform float dTime;
            uniform float aspect;
            uniform vec2 pointer;
            uniform float pointerDown;
            uniform float pointerRadius;
            uniform float pointerDuration;
            uniform sampler2D fbTexture;
            ${shader.fragmentShader}
          `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            
            float duration = pointerDuration;
            float rVal = texture2D(fbTexture, vUv).r;
            rVal -= clamp(dTime / duration, 0., 0.1);
            rVal = clamp(rVal, 0., 1.);
            
            float f = 0.;
            if (pointerDown > 0.5){
              vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
              vec2 mouse = pointer * vec2(aspect, 1);
              f = 1. - smoothstep(pointerRadius * 0.1, pointerRadius, distance(uv, mouse));
            }
            rVal += f * 0.1;
            rVal = clamp(rVal, 0., 1.);
            diffuseColor.rgb = vec3(rVal);
            `
          );
        }
      })
    );
    this.rtScene.material.defines = { USE_UV: "" };
    this.rtCamera = new THREE.Camera();
  }

  render() {
    this.renderer.setRenderTarget(this.rtOutput);
    this.renderer.render(this.rtScene, this.rtCamera);
    this.renderer.copyFramebufferToTexture(this.fbTexture.value);
    this.renderer.setRenderTarget(null);
  }

  setSize(w, h) {
    this.rtOutput.setSize(w, h);
  }
}

const gu = {
  dTime: { value: 0 },
  aspect: { value: innerWidth / innerHeight }
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const pointer = new THREE.Vector2(10, 10);

window.addEventListener("pointermove", event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

renderer.domElement.addEventListener("pointerleave", () => {
  pointer.set(10, 10);
});

function makeMaskTarget() {
  return new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
    depthBuffer: false,
    stencilBuffer: false
  });
}

let maskRead = makeMaskTarget();
let maskWrite = makeMaskTarget();

const maskScene = new THREE.Scene();
const maskCamera = new THREE.Camera();
const maskUniforms = {
  prevTexture: { value: maskRead.texture },
  pointer: { value: pointer },
  aspect: { value: gu.aspect.value },
  deltaTime: { value: 0 },
  brushRadius: { value: 0.42 },
  fadeSpeed: { value: 0.42 }
};

const maskMaterial = new THREE.ShaderMaterial({
  uniforms: maskUniforms,
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D prevTexture;
    uniform vec2  pointer;
    uniform float aspect;
    uniform float deltaTime;
    uniform float brushRadius;
    uniform float fadeSpeed;
    varying vec2 vUv;

    void main() {
      float prev  = texture2D(prevTexture, vUv).r;
      float faded = max(prev - deltaTime * fadeSpeed, 0.0);

      vec2 uv    = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
      vec2 mouse = pointer * vec2(aspect, 1.0);
      float glow = 1.0 - smoothstep(
        brushRadius * 0.15,
        brushRadius,
        distance(uv, mouse)
      );

      float mask = max(faded, glow);
      gl_FragColor = vec4(mask, mask, mask, 1.0);
    }
  `
});

maskScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), maskMaterial));

function fitPlaneToViewport(mesh, texture) {
  const imgAspect = texture.image.width / texture.image.height;
  const viewAspect = innerWidth / innerHeight;

  if (viewAspect > imgAspect) {
    mesh.scale.set(1, imgAspect / viewAspect, 1);
  } else {
    mesh.scale.set(viewAspect / imgAspect, 1, 1);
  }
}

const textureLoader = new THREE.TextureLoader();
const [texDotted, texReal] = await Promise.all([
  textureLoader.loadAsync("./photos/dotted.png"),
  textureLoader.loadAsync("./photos/real.png")
]);

[texDotted, texReal].forEach(texture => {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
});

const compositeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    texDotted: { value: texDotted },
    texReal: { value: texReal },
    texMask: { value: maskRead.texture }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D texDotted;
    uniform sampler2D texReal;
    uniform sampler2D texMask;
    varying vec2 vUv;

    void main() {
      vec4 dotted = texture2D(texDotted, vUv);
      vec4 real   = texture2D(texReal,   vUv);
      float mask  = texture2D(texMask,   vUv).r;

      float blend = smoothstep(0.15, 0.65, mask);

      vec3 col = mix(dotted.rgb, real.rgb, blend);
      gl_FragColor = vec4(col, 1.0);
    }
  `
});

const compositePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  compositeMaterial
);
fitPlaneToViewport(compositePlane, texDotted);
scene.add(compositePlane);

window.addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  gu.aspect.value = innerWidth / innerHeight;

  maskRead.setSize(innerWidth, innerHeight);
  maskWrite.setSize(innerWidth, innerHeight);

  fitPlaneToViewport(compositePlane, texDotted);
});

const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();

  gu.dTime.value = dt;

  maskUniforms.aspect.value = innerWidth / innerHeight;
  maskUniforms.deltaTime.value = dt;
  maskUniforms.pointer.value = pointer;

  maskUniforms.prevTexture.value = maskRead.texture;

  renderer.setRenderTarget(maskWrite);
  renderer.render(maskScene, maskCamera);
  renderer.setRenderTarget(null);

  [maskRead, maskWrite] = [maskWrite, maskRead];

  compositeMaterial.uniforms.texMask.value = maskRead.texture;

  renderer.render(scene, camera);
});
