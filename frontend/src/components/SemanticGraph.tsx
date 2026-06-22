import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const SemanticGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.01 });
      intersectionObserver.observe(container);
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const nodes: THREE.Mesh[] = [];
    const nodeCount = 12;
    const group = new THREE.Group();

    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      
      // Store velocity
      node.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        )
      };
      
      group.add(node);
      nodes.push(node);
    }

    // Lines connecting nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.5
    });

    interface LineData {
      line: THREE.Line;
      start: THREE.Mesh;
      end: THREE.Mesh;
    }
    const lines: LineData[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.6) {
          const points = [nodes[i].position, nodes[j].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          group.add(line);
          lines.push({ line, start: nodes[i], end: nodes[j] });
        }
      }
    }

    scene.add(group);
    camera.position.z = 5;

    const animate = () => {
      if (isVisible) {
        nodes.forEach((node) => {
          const velocity = node.userData.velocity as THREE.Vector3;
          node.position.add(velocity);
          if (Math.abs(node.position.x) > 3) velocity.x *= -1;
          if (Math.abs(node.position.y) > 2) velocity.y *= -1;
          if (Math.abs(node.position.z) > 1.5) velocity.z *= -1;
        });

        lines.forEach((item) => {
          const positions = item.line.geometry.attributes.position.array as Float32Array;
          positions[0] = item.start.position.x;
          positions[1] = item.start.position.y;
          positions[2] = item.start.position.z;
          positions[3] = item.end.position.x;
          positions[4] = item.end.position.y;
          positions[5] = item.end.position.z;
          item.line.geometry.attributes.position.needsUpdate = true;
        });

        group.rotation.y += 0.0015;
        group.rotation.x += 0.0005;
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      
      // Cleanup Three.js resources
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach((item) => {
        item.line.geometry.dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};
