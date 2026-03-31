import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  ReactFlow,
  addEdge,
  Node,
  Edge,
  BaseEdge,
  EdgeProps,
  useNodesState,
  useEdgesState,
  NodeProps,
  Handle,
  Position,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MemoPersonCard } from "@/app/(main)/tree/person-card";
import ContextMenuCard from "@/app/(main)/tree/context-menu-card";

export function PersonNode({ data, ...card }: any) {
  const {
    highlightHandles,
    focusPerson,
    hoveredHandle,
    editorMode,
    selectedCard,
    collapsedBranches,
    hasChildren,
    onHover,
    onClick,
    onSetFocus,
    onToggleCollapse,
  } = card;

  return (
    <div
      style={{
        height: "80px",
        width: "180px",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <MemoPersonCard
        item={{
          x: data.positionAbsoluteX,
          y: data.positionAbsoluteY,
          ...data.data,
        }}
        isHighlighted={highlightHandles.has(data?.data?.handle)}
        isFocused={focusPerson === data?.data?.handle}
        isHovered={hoveredHandle === data?.data?.handle}
        isSelected={editorMode && selectedCard === data?.data?.handle}
        showCollapseToggle={hasChildren(data?.data?.handle)}
        isCollapsed={collapsedBranches.has(data?.data?.handle)}
        onHover={onHover}
        onClick={onClick}
        onSetFocus={onSetFocus}
        onToggleCollapse={onToggleCollapse}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
export function FixedStepEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, data, id, markerEnd, style } =
    props;

  const verticalOffset = 20;

  const midY = sourceY + verticalOffset;

  const path = `
    M ${sourceX},${sourceY}
    L ${sourceX},${midY}
    L ${targetX},${midY}
    L ${targetX},${targetY}
  `;

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {data?.isCouple && (
        <text
          x={targetX}
          y={targetY + 6}
          textAnchor="middle"
          fontSize="12"
          style={{ pointerEvents: "none" }}
        >
          ❤️
        </text>
      )}
    </>
  );
}

interface Family {
  handle: string;
  fatherHandle: string | null;
  motherHandle: string | null;
  children: string[];
}

interface LayoutedPerson {
  node: {
    handle: string;
    displayName: string;
  };
}

interface FamilyNodeData extends Record<string, unknown> {
  label: string;
}

type EdgeOptions = {
  id: string;
  source: string;
  target: string;
  type?: string;
} & Record<string, unknown>;

const NODE_GAP = 220;
const LEVEL_GAP = 170;

const handleEdges = ({
  id,
  source,
  target,
  type = "fixed",
  ...props
}: EdgeOptions) => {
  return {
    id,
    source,
    target,
    type,
    ...props,
  };
};

export function buildFamilyGraph(
  persons: LayoutedPerson[] = [],
  families: Family[] = [],
): {
  nodes: Node<FamilyNodeData>[];
  edges: Edge[];
} {
  const nodes: Node<FamilyNodeData>[] = [];
  const edges: Edge[] = [];

  const fatherMap: Record<string, Family[]> = {};
  const allChildren = new Set<string>();
  const positionMap: Record<string, { x: number; y: number }> = {};

  let globalX = 0;

  // ===== Build father map =====
  families.forEach((fam) => {
    if (fam.fatherHandle) {
      if (!fatherMap[fam.fatherHandle]) {
        fatherMap[fam.fatherHandle] = [];
      }
      fatherMap[fam.fatherHandle].push(fam);
    }

    fam.children?.forEach((c) => allChildren.add(c));
  });

  // ===== Find root (father không phải con ai) =====
  const root = Object.keys(fatherMap).find((f) => !allChildren.has(f));

  if (!root) {
    return { nodes, edges };
  }

  // ===== DFS FAMILY =====
  function dfsFamily(fatherId: string, family: Family, level: number): number {
    const { motherHandle, children } = family;

    const childXs: number[] = [];

    children.forEach((child) => {
      const x = dfsPerson(child, level + 2);
      childXs.push(x);
    });

    let centerX: number;

    if (childXs.length === 0) {
      centerX = globalX;
      globalX += NODE_GAP;
    } else {
      centerX = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    }

    // mother
    if (motherHandle) {
      positionMap[motherHandle] = {
        x: centerX,
        y: (level / 2) * LEVEL_GAP + 40,
      };

      edges.push({
        ...handleEdges({
          id: `${fatherId}-${motherHandle}`,
          source: fatherId,
          target: motherHandle,
          data: {
            isCouple: true,
          },
        }),
      });
    }

    // children edges
    children.forEach((child) => {
      if (motherHandle) {
        edges.push({
          ...handleEdges({
            id: `${motherHandle}-${child}`,
            source: motherHandle,
            target: child,
          }),
        });
      } else {
        edges.push({
          ...handleEdges({
            id: `${fatherId}-${child}`,
            source: fatherId,
            target: child,
          }),
        });
      }
    });

    return centerX;
  }

  // ===== DFS PERSON =====
  function dfsPerson(personId: string, level: number): number {
    const fams = fatherMap[personId] || [];

    if (fams.length === 0) {
      const x = globalX;
      globalX += NODE_GAP;

      positionMap[personId] = {
        x,
        y: (level / 2) * LEVEL_GAP,
      };

      return x;
    }

    const branchXs: number[] = [];

    fams.forEach((fam) => {
      const x = dfsFamily(personId, fam, level + 1);
      branchXs.push(x);
    });

    const centerX = (Math.min(...branchXs) + Math.max(...branchXs)) / 2;

    positionMap[personId] = {
      x: centerX,
      y: (level / 2) * LEVEL_GAP,
    };

    return centerX;
  }

  // ===== Start =====
  dfsPerson(root, 0);

  // ===== Convert persons to nodes =====
  persons.forEach((node: any) => {
    const { handle, hidden } = node;
    const pos = positionMap[handle];

    if (!pos || hidden) return;

    nodes.push({
      id: handle,
      position: pos,
      data: { ...node },
      type: "person",
    });
  });
  return { nodes, edges };
}

export type TreeFlowRef = {
  fit: () => void;
  reset: () => void;
};

const TreeFlow = forwardRef<TreeFlowRef, any>(function TreeFlow(
  { treeData, card },
  ref,
) {
  const [rf, setRf] = useState(null);
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFamilyGraph(treeData?.people, treeData?.families),
    [treeData?.families, treeData?.people],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useEffect(() => {
    setNodes(initialNodes || []);
    setEdges(initialEdges || []);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const edgeTypes = {
    fixed: FixedStepEdge,
  };

  const nodeTypes = {
    person: (data: any) => <PersonNode data={data} {...card} />,
    "context-menu": ContextMenuCard,
  };

  // 👇 expose function cho cha
  useImperativeHandle(ref, () => ({
    reset() {
      setNodes(initialNodes || []);
      setEdges(initialEdges || []);
    },
    fit: () => (rf as any)?.fitView?.(),
    ...(rf || {}),
  }));

  return (
    <ReactFlow
      onInit={(instance: any) => setRf(instance)}
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodesDraggable={false}
    >
      <MiniMap />
    </ReactFlow>
  );
});
export default TreeFlow;
