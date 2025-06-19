"use client";
import { useEffect, useRef } from "react";

export default function ARPresentationModal({ open, onClose }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!open || !mountRef.current) return;
    // Dynamically load Three.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js";
    script.onload = () => {
      // @ts-ignore
      const THREE = window.THREE;
      const width = 400, height = 300;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(renderer.domElement);
      // Pyramid geometry
      const geometry = new THREE.ConeGeometry(1, 1.5, 4);
      const material = new THREE.MeshStandardMaterial({ color: 0xfbbf24, flatShading: true });
      const pyramid = new THREE.Mesh(geometry, material);
      scene.add(pyramid);
      // Lighting
      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(2, 3, 5);
      scene.add(light);
      camera.position.z = 3;
      function animate() {
        requestAnimationFrame(animate);
        pyramid.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    };
    document.body.appendChild(script);
    return () => {
      if (mountRef.current) mountRef.current.innerHTML = "";
      document.body.removeChild(script);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg relative w-[440px]">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-yellow-300">AR Presentation</h2>
        <div ref={mountRef} className="w-[400px] h-[300px] mx-auto" />
        <div className="mt-4 text-gray-300 text-sm">3D Pyramid (placeholder). Integrate AR.js or generative overlays here.</div>
      </div>
    </div>
  );
}