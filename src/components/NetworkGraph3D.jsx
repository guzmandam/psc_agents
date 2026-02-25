import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { lerpColor } from '../core/config';

const sharedGeometry = new THREE.SphereGeometry(1, 12, 12);
const dissatisfiedRingGeometry = new THREE.RingGeometry(1.15, 1.35, 16);
const dissatisfiedRingMaterial = new THREE.MeshBasicMaterial({
  color: '#facc15',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8,
});

const materialCache = new Map();

function getMaterial(colorStr) {
  if (materialCache.has(colorStr)) return materialCache.get(colorStr);
  const mat = new THREE.MeshLambertMaterial({
    color: colorStr,
    transparent: true,
    opacity: 0.9,
  });
  materialCache.set(colorStr, mat);
  return mat;
}

export const NetworkGraph3D = () => {
  const agents = useStore((s) => s.agents);
  const interactionEdges = useStore((s) => s.interactionEdges);
  const darkMode = useStore((s) => s.darkMode);
  const getActiveColors = useStore((s) => s.getActiveColors);
  const containerRef = useRef(null);
  const fgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const throttleRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height: Math.max(height, 500) });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const graphData = useMemo(() => {
    const now = Date.now();
    if (now - throttleRef.current < 300) return null;
    throttleRef.current = now;

    const { colorA, colorB } = getActiveColors();

    const nodes = agents.map((agent) => {
      const t = (agent.ideology + 1) / 2;
      const [r, g, b] = lerpColor(colorA, colorB, t);
      const size = 2 + Math.log10(Math.max(1, agent.status)) * 3;
      return {
        id: agent.id,
        x: (agent.x - 25) * 4,
        y: (agent.y - 25) * 4,
        z: agent.ideology * 40,
        color: `rgb(${r},${g},${b})`,
        size,
        ideology: agent.ideology,
        status: agent.status,
        isDissatisfied: agent.isDissatisfied,
      };
    });

    const edgeSet = new Set();
    const links = [];
    for (const edge of interactionEdges) {
      const key = edge.source < edge.target
        ? `${edge.source}-${edge.target}`
        : `${edge.target}-${edge.source}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      links.push({
        source: edge.source,
        target: edge.target,
        color: edge.success
          ? 'rgba(74, 222, 128, 0.35)'
          : 'rgba(248, 113, 113, 0.15)',
        width: edge.success ? 1.2 : 0.4,
      });
    }

    return { nodes, links };
  }, [agents, interactionEdges, getActiveColors]);

  const lastGraphData = useRef({ nodes: [], links: [] });
  const activeGraphData = graphData || lastGraphData.current;
  if (graphData) lastGraphData.current = graphData;

  const handleLinkColor = useCallback((link) => link.color, []);
  const handleLinkWidth = useCallback((link) => link.width, []);

  const nodeThreeObject = useCallback((node) => {
    const mesh = new THREE.Mesh(sharedGeometry, getMaterial(node.color));
    mesh.scale.setScalar(node.size);

    if (node.isDissatisfied) {
      const ring = new THREE.Mesh(dissatisfiedRingGeometry, dissatisfiedRingMaterial);
      ring.scale.setScalar(node.size);
      mesh.add(ring);
    }

    return mesh;
  }, []);

  return (
    <div ref={containerRef} className="w-full" style={{ height: '600px' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={activeGraphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={darkMode ? '#0a0a1a' : '#f1f5f9'}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={handleLinkColor}
        linkWidth={handleLinkWidth}
        linkOpacity={0.6}
        enableNodeDrag={false}
        cooldownTime={500}
        d3AlphaDecay={0.05}
        d3VelocityDecay={0.4}
        nodeLabel={(node) =>
          `ID: ${node.id} | Ideología: ${node.ideology.toFixed(2)} | Estatus: ${node.status.toFixed(1)}`
        }
      />
    </div>
  );
};
