import { useState } from 'react';
import { ChevronRight, ChevronDown, Box, Layers, GitBranch, Wrench } from 'lucide-react';
import { InventoryItem } from '../types';

interface TreeViewProps {
  items: InventoryItem[];
  selectedId: string | null;
  onSelect: (item: InventoryItem) => void;
}

interface TreeNodeProps {
  item: InventoryItem;
  level: number;
  selectedId: string | null;
  onSelect: (item: InventoryItem) => void;
}

const getItemIcon = (type: string) => {
  switch (type) {
    case 'asset':
      return Box;
    case 'area':
      return Layers;
    case 'line':
      return GitBranch;
    case 'equipment':
      return Wrench;
    default:
      return Box;
  }
};

function TreeNode({ item, level, selectedId, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = getItemIcon(item.item_type);
  const isSelected = selectedId === item.id;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-blue-50 transition-colors ${
          isSelected ? 'bg-blue-100 border-l-4 border-blue-600' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => onSelect(item)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-blue-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
              {item.code}
            </span>
            <span className={`text-sm truncate ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'}`}>
              {item.name}
            </span>
          </div>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ items, selectedId, onSelect }: TreeViewProps) {
  return (
    <div className="bg-white border-r border-gray-200 overflow-y-auto">
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
