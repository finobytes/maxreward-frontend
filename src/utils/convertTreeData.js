export function convertToApexTreeFormat(apiData) {
  if (!apiData?.data?.root_member || !apiData?.data?.tree_structure) {
    return null;
  }

  const rootMember = apiData.data.root_member;
  const treeLevels = Array.isArray(apiData.data.tree_structure)
    ? apiData.data.tree_structure
    : [];

  const levelColors = ["#ffafcc", "#cdb4db", "#ffc8dd", "#bde0fe", "#a2d2ff"];
  const DUMMY_IMAGE =
    "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";

  const normalizeId = (id) => (id == null ? null : id.toString());

  // Node builder
  const makeNode = (member, level, position = null) => ({
    id: normalizeId(member.id),
    data: {
      name: member.name,
      phone: member.phone || member.name,
      imageURL: member.image || DUMMY_IMAGE,
      position,
    },
    options: {
      nodeBGColor: levelColors[level % levelColors.length],
    },
    children: [],
  });

  // Map of ID -> Node
  const nodeMap = new Map();
  const parentById = new Map();
  const childrenById = new Map();

  const getOrCreateNode = (member, level, position = null) => {
    if (!member?.id) return null;
    const id = normalizeId(member.id);
    if (!id) return null;

    let node = nodeMap.get(id);
    if (!node) {
      node = makeNode(member, level, position);
      nodeMap.set(id, node);
      return node;
    }

    node.data = node.data || {};
    node.options = node.options || {};
    node.children = node.children || [];

    if (member.name && !node.data.name) node.data.name = member.name;
    if (member.phone && node.data.phone === node.data.name) {
      node.data.phone = member.phone;
    } else if (!node.data.phone && (member.phone || member.name)) {
      node.data.phone = member.phone || member.name;
    }
    if (member.image && node.data.imageURL === DUMMY_IMAGE) {
      node.data.imageURL = member.image;
    } else if (!node.data.imageURL) {
      node.data.imageURL = member.image || DUMMY_IMAGE;
    }
    if (position && !node.data.position) node.data.position = position;
    if (!node.options.nodeBGColor) {
      node.options.nodeBGColor = levelColors[level % levelColors.length];
    }

    return node;
  };

  // Create root node
  const rootNode = getOrCreateNode(rootMember, 0);
  if (!rootNode) return null;
  const rootId = rootNode.id;

  const wouldCreateCycle = (parentId, childId) => {
    let cursor = parentId;
    while (parentById.has(cursor)) {
      cursor = parentById.get(cursor);
      if (cursor === childId) return true;
    }
    return false;
  };

  const addChild = (parent, childMember, position, level) => {
    if (!parent || !childMember) return;
    const child = getOrCreateNode(childMember, level, position);
    if (!child) return;

    const parentId = parent.id;
    const childId = child.id;

    if (!parentId || !childId) return;
    if (parentId === childId) return;
    if (childId === rootId) return;
    if (wouldCreateCycle(parentId, childId)) return;

    const existingParent = parentById.get(childId);
    if (existingParent && existingParent !== parentId) return;

    let childrenSet = childrenById.get(parentId);
    if (!childrenSet) {
      childrenSet = new Set();
      childrenById.set(parentId, childrenSet);
    }

    if (childrenSet.has(childId)) return;

    childrenSet.add(childId);
    parent.children.push(child);
    parentById.set(childId, parentId);
  };

  // Fill node map and connect children
  treeLevels.forEach((level, idx) => {
    const currentLevel = Number(level?.level) || idx + 1;
    const nodes = Array.isArray(level?.nodes) ? level.nodes : [];

    nodes.forEach((n) => {
      const parent = n?.parent
        ? getOrCreateNode(n.parent, currentLevel - 1)
        : null;
      if (!parent) return;

      addChild(parent, n.left_child, "left", currentLevel);
      addChild(parent, n.right_child, "right", currentLevel);
    });
  });

  return rootNode;
}
