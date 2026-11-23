import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  isSpecial?: boolean;
  label?: string;
  category?: 'sensors' | 'automation' | 'iot' | 'analytics';
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export const ConnectedNetworkCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle canvas dimensions with devicePixelRatio for ultra-sharp rendering
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion) {
        lastTime = performance.now();
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Nodes and Packets arrays
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let connections: [number, number, number][] = []; // [nodeA, nodeB, distance]

    const initNodes = () => {
      nodes = [];
      packets = [];
      connections = [];

      const isMobile = width < 768;
      const nodeCount = isMobile ? 18 : 34;

      // 4 Special Themed Nodes at the periphery representing Connected Engineering
      const specialNodesData: { x: number; y: number; label: string; category: Node['category'] }[] = [
        {
          x: width * 0.12,
          y: height * 0.22,
          label: 'SENSORES & INSTRUMENTAÇÃO',
          category: 'sensors',
        },
        {
          x: width * 0.14,
          y: height * 0.76,
          label: 'CONTROLADORES & AUTOMAÇÃO',
          category: 'automation',
        },
        {
          x: width * 0.88,
          y: height * 0.24,
          label: 'COMUNICAÇÃO IoT & CONECTIVIDADE',
          category: 'iot',
        },
        {
          x: width * 0.86,
          y: height * 0.78,
          label: 'SOFTWARE & SUPERVISÃO VCR',
          category: 'analytics',
        },
      ];

      // Add Special nodes
      specialNodesData.forEach((s) => {
        nodes.push({
          x: s.x,
          y: s.y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 3.5,
          baseAlpha: 0.85,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02,
          isSpecial: true,
          label: isMobile ? undefined : s.label,
          category: s.category,
        });
      });

      // Generate peripheral and border nodes, keeping the center clean
      for (let i = 0; i < nodeCount; i++) {
        let x = 0;
        let y = 0;

        // Place 75% on sides, 25% on top/bottom, avoiding center
        const isLeftSide = Math.random() < 0.5;
        if (Math.random() < 0.75) {
          // Left or Right band
          x = isLeftSide
            ? Math.random() * (width * 0.28)
            : width * 0.72 + Math.random() * (width * 0.28);
          y = Math.random() * height;
        } else {
          // Top or Bottom band
          x = Math.random() * width;
          y = Math.random() < 0.5 ? Math.random() * (height * 0.2) : height * 0.82 + Math.random() * (height * 0.18);
        }

        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          radius: 1.6 + Math.random() * 1.4,
          baseAlpha: 0.25 + Math.random() * 0.45,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          isSpecial: false,
        });
      }
    };

    initNodes();

    let lastTime = performance.now();
    let packetTimer = 0;

    const render = () => {
      if (!isVisible) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Define central clear zone (ellipse around title and cards)
      const centerX = width / 2;
      const centerY = height / 2;
      const safeRadiusX = width * 0.32;
      const safeRadiusY = height * 0.36;

      // Update nodes positions with smooth drifting and soft bounce
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!reducedMotion) {
          node.x += node.vx * (dt * 60);
          node.y += node.vy * (dt * 60);
          node.pulsePhase += node.pulseSpeed;

          // Gentle bounce at screen boundaries
          if (node.x < 15) {
            node.x = 15;
            node.vx = Math.abs(node.vx);
          } else if (node.x > width - 15) {
            node.x = width - 15;
            node.vx = -Math.abs(node.vx);
          }

          if (node.y < 15) {
            node.y = 15;
            node.vy = Math.abs(node.vy);
          } else if (node.y > height - 15) {
            node.y = height - 15;
            node.vy = -Math.abs(node.vy);
          }

          // Soft repulsion from central area to keep title readable
          const dx = node.x - centerX;
          const dy = node.y - centerY;
          const normDist = (dx * dx) / (safeRadiusX * safeRadiusX) + (dy * dy) / (safeRadiusY * safeRadiusY);
          if (normDist < 1) {
            const pushFactor = (1 - normDist) * 0.3;
            node.x += (dx / Math.sqrt(dx * dx + dy * dy || 1)) * pushFactor;
            node.y += (dy / Math.sqrt(dx * dx + dy * dy || 1)) * pushFactor;
          }
        }
      }

      // Find connections between nearby nodes
      connections = [];
      const maxDistance = width < 768 ? 120 : 170;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          // Only connect if distance is within range and not cutting straight across the central focus area
          if (dist < maxDistance) {
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const centerDist = ((midX - centerX) ** 2) / (safeRadiusX * safeRadiusX) + ((midY - centerY) ** 2) / (safeRadiusY * safeRadiusY);

            // Allow connection if outside center, or allow with very low opacity
            if (centerDist > 0.65) {
              connections.push([i, j, dist]);
            }
          }
        }
      }

      // Draw Connection Lines
      const isDark = isDarkRef.current;
      for (let k = 0; k < connections.length; k++) {
        const [i, j, dist] = connections[k];
        const a = nodes[i];
        const b = nodes[j];

        const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.44);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isDark
          ? `rgba(0, 223, 0, ${alpha.toFixed(3)})`
          : `rgba(8, 124, 59, ${alpha.toFixed(3)})`;
        ctx.lineWidth = a.isSpecial || b.isSpecial ? (isDark ? 0.9 : 1.35) : (isDark ? 0.6 : 0.85);
        ctx.stroke();
      }

      // Periodic packet emission (light pulses travelling along connections)
      if (!reducedMotion) {
        packetTimer += dt;
        if (packetTimer > 0.4 && connections.length > 0 && packets.length < 14) {
          packetTimer = 0;
          const randomConn = connections[Math.floor(Math.random() * connections.length)];
          const forward = Math.random() < 0.5;
          packets.push({
            fromNode: forward ? randomConn[0] : randomConn[1],
            toNode: forward ? randomConn[1] : randomConn[0],
            progress: 0,
            speed: 0.012 + Math.random() * 0.018,
          });
        }

        // Draw and update packets
        for (let p = packets.length - 1; p >= 0; p--) {
          const packet = packets[p];
          packet.progress += packet.speed;

          const from = nodes[packet.fromNode];
          const to = nodes[packet.toNode];

          if (!from || !to || packet.progress >= 1) {
            packets.splice(p, 1);
            continue;
          }

          const curX = from.x + (to.x - from.x) * packet.progress;
          const curY = from.y + (to.y - from.y) * packet.progress;

          // Packet glow and core
          ctx.beginPath();
          ctx.arc(curX, curY, isDark ? 2.2 : 2.6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#00DF00' : '#087C3B';
          ctx.shadowColor = isDark ? '#00DF00' : 'rgba(8, 124, 59, 0.75)';
          ctx.shadowBlur = isDark ? 8 : 7;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase) * 0.2;
        const currentAlpha = Math.max(0.15, Math.min(1, node.baseAlpha + pulse));

        if (node.isSpecial) {
          // Special Infrastructure Node (with radar orbital ring)
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 5 + Math.sin(node.pulsePhase) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? `rgba(0, 223, 0, ${(currentAlpha * 0.35).toFixed(2)})`
            : `rgba(8, 124, 59, ${(currentAlpha * 0.65).toFixed(2)})`;
          ctx.lineWidth = isDark ? 1 : 1.35;
          ctx.stroke();

          // Hexagonal contour or inner ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, isDark ? node.radius : node.radius + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#00DF00' : '#087C3B';
          ctx.shadowColor = isDark ? '#00DF00' : 'rgba(8, 124, 59, 0.5)';
          ctx.shadowBlur = isDark ? 10 : 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Clear, crisp text label on desktop
          if (node.label) {
            ctx.font = isDark ? '500 9px monospace' : '600 10px monospace';
            ctx.fillStyle = isDark ? 'rgba(0, 223, 0, 0.45)' : 'rgba(23, 44, 34, 0.88)';
            ctx.fillText(node.label, node.x + 12, node.y + 3);
          }
        } else {
          // Regular Network Node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(0, 223, 0, ${currentAlpha.toFixed(2)})`
            : `rgba(8, 124, 59, ${(currentAlpha * 0.95).toFixed(2)})`;
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // First render
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
