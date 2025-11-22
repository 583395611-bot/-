import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SpatialGraphData, GraphNode, GraphLink } from '../types';

interface ForceGraphProps {
  data: SpatialGraphData;
  width?: number;
  height?: number;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data, width = 600, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Color scale based on group
    const color = d3.scaleOrdinal<string>()
      .domain(["1", "2", "3"])
      .range(["#06b6d4", "#f43f5e", "#8b5cf6"]); // Cyan (Zone), Rose (User), Violet (Element)

    // Deep copy data to avoid mutating props during d3 simulation
    const nodes = data.nodes.map(d => ({ ...d })) as (GraphNode & d3.SimulationNodeDatum)[];
    const links = data.links.map(d => ({ ...d })) as (GraphLink & d3.SimulationLinkDatum<d3.SimulationNodeDatum>)[];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Draw Links
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.5);

    // Draw Nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.type === 'zone' ? 12 : (d.type === 'user' ? 8 : 6))
      .attr("fill", d => {
        if (d.type === 'zone') return '#06b6d4'; // Cyan
        if (d.type === 'user') return '#f43f5e'; // Rose
        return '#8b5cf6'; // Violet
      })
      .call(d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Labels
    const labels = svg.append("g")
      .attr("class", "texts")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.label)
      .attr("font-size", d => d.type === 'zone' ? "12px" : "10px")
      .attr("fill", "#cbd5e1")
      .attr("dx", 15)
      .attr("dy", 4);

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      labels
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return (
    <div className="bg-architect-900 rounded-xl border border-architect-800 overflow-hidden relative shadow-lg">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">空间关系图</h3>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-cyan"></div>区域</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent-rose"></div>用户</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>设计元素</span>
        </div>
      </div>
      <svg ref={svgRef} width={width} height={height} className="w-full h-full cursor-move" />
    </div>
  );
};

export default ForceGraph;