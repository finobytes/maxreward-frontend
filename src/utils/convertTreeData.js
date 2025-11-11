export function convertToApexTreeFormat(apiData) {
  if (!apiData?.data?.root_member || !apiData?.data?.tree_structure)
    return null;

  const rootMember = apiData.data.root_member;
  const treeLevels = apiData.data.tree_structure;

  const levelColors = ["#ffafcc", "#cdb4db", "#ffc8dd", "#bde0fe", "#a2d2ff"];
  const DUMMY_IMAGE =
    "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250";
  // Node builder
  const makeNode = (member, level, position = null) => ({
    id: member.id.toString(),
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

  // Map of ID → Node
  const nodeMap = {};

  // Create root node
  const rootNode = makeNode(rootMember, 0);
  nodeMap[rootMember.id] = rootNode;

  // Fill node map and connect children
  treeLevels.forEach((level, idx) => {
    const currentLevel = idx + 1;

    level.nodes.forEach((n) => {
      const parent = n.parent
        ? nodeMap[n.parent.id] || makeNode(n.parent, currentLevel - 1)
        : null;
      if (parent) nodeMap[n.parent.id] = parent;

      if (n.left_child) {
        const leftNode =
          nodeMap[n.left_child.id] ||
          makeNode(n.left_child, currentLevel, "left");
        nodeMap[n.left_child.id] = leftNode;
        parent.children.push(leftNode);
      }

      if (n.right_child) {
        const rightNode =
          nodeMap[n.right_child.id] ||
          makeNode(n.right_child, currentLevel, "right");
        nodeMap[n.right_child.id] = rightNode;
        parent.children.push(rightNode);
      }
    });
  });

  return rootNode;
}
