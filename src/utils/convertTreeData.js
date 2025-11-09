export function convertToApexTreeFormat(apiData) {
  if (!apiData?.data?.root_member || !apiData?.data?.tree) return null;

  const root = apiData.data.root_member;

  const levelColors = [
    "#ffafcc", // Level 1
    "#cdb4db", // Level 2
    "#ffc8dd", // Level 3
    "#bde0fe", // Level 4
    "#a2d2ff", // Level 5
  ];

  // 🧩 helper function to make nodes
  const makeNode = (member, level = 0) => ({
    id: member.id.toString(),
    data: {
      name: member.name,
      username: member.user_name,
      phone: member.phone || "",
      status: member.status || "active",
      imageURL:
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
    options: {
      nodeBGColor: levelColors[level % levelColors.length],
      nodeBGColorHover: levelColors[level % levelColors.length],
    },
    children: [],
  });

  // 🗂️ flatten tree levels
  const levels = apiData.data.tree;
  const nodesByLevel = {};

  levels.forEach((level) => {
    nodesByLevel[level.level] = level.members.map((m) =>
      makeNode(m, level.level - 1)
    );
  });

  // 🌳 root node
  const rootNode = makeNode(root, 0);

  // 🔗 Build hierarchy dynamically (auto chain next level under previous)
  Object.keys(nodesByLevel).forEach((lvl) => {
    const currentLevel = parseInt(lvl);
    const nextLevel = currentLevel + 1;

    if (nodesByLevel[nextLevel]) {
      // distribute children evenly (rough logic since real parent relation missing)
      nodesByLevel[currentLevel].forEach((node, index) => {
        const childrenPerParent = Math.floor(
          nodesByLevel[nextLevel].length / nodesByLevel[currentLevel].length
        );
        const start = index * childrenPerParent;
        const end = start + childrenPerParent;
        node.children = nodesByLevel[nextLevel].slice(start, end);
      });
    }
  });

  // attach level 1 under root
  rootNode.children = nodesByLevel[1] || [];

  return rootNode;
}
