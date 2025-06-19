"use client";
import { useEffect, useRef } from "react";

export default function ARMarkerModal({ open, onClose }) {
  const arRef = useRef(null);

  useEffect(() => {
    if (!open || !arRef.current) return;
    // Load AR.js and Three.js from CDN
    const arScript = document.createElement("script");
    arScript.src = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/build/ar-threex.js";
    document.body.appendChild(arScript);
    arScript.onload = () => {
      // Show instructions if AR.js fails
      if (!window.THREEx) {
        arRef.current.innerHTML = '<div class="text-red-400">AR.js failed to load. Try HTTPS and allow camera access.</div>';
        return;
      }
      // Minimal AR.js marker scene
      arRef.current.innerHTML = '';
      const width = 400, height = 300;
      const renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      arRef.current.appendChild(renderer.domElement);
      const scene = new window.THREE.Scene();
      const camera = new window.THREE.Camera();
      scene.add(camera);
      // ARToolkit Source
      const source = new window.THREEx.ArToolkitSource({ sourceType: 'webcam' });
      source.init(() => setTimeout(() => onResize(), 200));
      function onResize() { source.onResize(); source.copySizeTo(renderer.domElement); }
      window.addEventListener('resize', onResize);
      // ARToolkit Context
      const context = new window.THREEx.ArToolkitContext({ cameraParametersUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/data/camera_para.dat', detectionMode: 'mono' });
      context.init(() => camera.projectionMatrix.copy(context.getProjectionMatrix()));
      // Marker Controls
      const marker = new window.THREEx.ArMarkerControls(context, camera, { type: 'pattern', patternUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/data/patt.hiro', changeMatrixMode: 'cameraTransformMatrix' });
      // 3D Cube
      const geometry = new window.THREE.BoxGeometry(1, 1, 1);
      const material = new window.THREE.MeshNormalMaterial();
      const cube = new window.THREE.Mesh(geometry, material);
      cube.position.y = 0.5;
      scene.add(cube);
      // Render loop
      function animate() {
        requestAnimationFrame(animate);
        if (source.ready) context.update(source.domElement);
        renderer.render(scene, camera);
        cube.rotation.y += 0.01;
      }
      animate();
    };
    return () => {
      if (arRef.current) arRef.current.innerHTML = '';
      document.body.removeChild(arScript);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg relative w-[440px]">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-yellow-300">AR Marker Tracking</h2>
        <div ref={arRef} className="w-[400px] h-[300px] mx-auto bg-black rounded" />
        <div className="mt-4 text-gray-300 text-sm">Point your camera at this marker:</div>
        <div className="flex justify-center mt-2"><img src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/data/HIRO.jpg" alt="Hiro marker" className="w-24 h-24 border-2 border-yellow-300 rounded" /></div>
        <div className="mt-2 text-xs text-gray-400">If you don't see the camera, check browser permissions and HTTPS.</div>
      </div>
    </div>
  );
}