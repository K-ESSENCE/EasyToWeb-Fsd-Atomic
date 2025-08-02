import { useEditor } from "@craftjs/core";

export const NodeActions: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { actions, query } = useEditor();

  const duplicateNode = () => {
    // TODO: Implement node duplication
    console.log("Node duplication feature to be implemented");
    alert("복제 기능은 곧 구현될 예정입니다.");
  };

  const moveUp = () => {
    const node = query.node(nodeId).get();
    if (node && node.data.parent) {
      const parent = query.node(node.data.parent).get();
      if (parent) {
        const siblings = parent.data.nodes;
        const currentIndex = siblings.indexOf(nodeId);
        if (currentIndex > 0) {
          const newSiblings = [...siblings];
          [newSiblings[currentIndex], newSiblings[currentIndex - 1]] = [
            newSiblings[currentIndex - 1],
            newSiblings[currentIndex],
          ];
          actions.move(nodeId, node.data.parent, currentIndex - 1);
        }
      }
    }
  };

  const moveDown = () => {
    const node = query.node(nodeId).get();
    if (node && node.data.parent) {
      const parent = query.node(node.data.parent).get();
      if (parent) {
        const siblings = parent.data.nodes;
        const currentIndex = siblings.indexOf(nodeId);
        if (currentIndex < siblings.length - 1) {
          actions.move(nodeId, node.data.parent, currentIndex + 1);
        }
      }
    }
  };

  const deleteNode = () => {
    if (confirm("정말로 이 컴포넌트를 삭제하시겠습니까?")) {
      actions.delete(nodeId);
    }
  };

  return (
    <div className="node-actions flex items-center gap-1">
      <button
        onClick={moveUp}
        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
        title="위로 이동"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <button
        onClick={moveDown}
        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
        title="아래로 이동"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <button
        onClick={duplicateNode}
        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
        title="복제"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>

      <button
        onClick={deleteNode}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="삭제"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export const NodeValidator: React.FC = () => {
  const { query } = useEditor();

  const validateNodes = () => {
    const nodes = query.getNodes();
    const errors: string[] = [];

    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];

      // Check for circular references
      if (node.data.parent && node.data.parent === nodeId) {
        errors.push(`Node ${nodeId} has circular parent reference`);
      }

      // Check if parent exists
      if (
        node.data.parent &&
        node.data.parent !== "ROOT" &&
        !nodes[node.data.parent]
      ) {
        errors.push(`Node ${nodeId} has missing parent ${node.data.parent}`);
      }

      // Check if children exist
      node.data.nodes.forEach((childId) => {
        if (!nodes[childId]) {
          errors.push(`Node ${nodeId} has missing child ${childId}`);
        }
      });
    });

    if (errors.length > 0) {
      console.warn("Node validation errors:", errors);
      alert(`검증 오류가 발견되었습니다:\n${errors.join("\n")}`);
    } else {
      console.log("All nodes are valid");
    }
  };

  return (
    <button
      onClick={validateNodes}
      className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
      title="노드 구조 검증"
    >
      <svg
        className="w-4 h-4 inline mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      검증
    </button>
  );
};

export const NodeInfo: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { query } = useEditor();
  const node = query.node(nodeId).get();

  if (!node) return null;

  return (
    <div className="node-info p-3 bg-gray-50 rounded-md text-xs">
      <div className="font-medium text-gray-900 mb-2">노드 정보</div>
      <div className="space-y-1 text-gray-600">
        <div>ID: {nodeId}</div>
        <div>
          타입:{" "}
          {node.data.displayName ||
            (typeof node.data.type === "string" ? node.data.type : "Component")}
        </div>
        <div>부모: {node.data.parent || "ROOT"}</div>
        <div>자식: {node.data.nodes.length}개</div>
        {node.data.isCanvas && (
          <div className="text-blue-600">캔버스 컨테이너</div>
        )}
      </div>
    </div>
  );
};
