import React, { useEffect, useRef } from "react";
import ApexTree from "apextree";
import { convertToApexTreeFormat } from "../../../utils/convertTreeData";
import { tree } from "../../../constant/tree";

const Community = () => {
  const treeContainerRef = useRef(null);

  useEffect(() => {
    if (!treeContainerRef.current) return;

    // 🔹 তোমার API data কে ApexTree ফরম্যাটে কনভার্ট করো
    const treeData = convertToApexTreeFormat(tree);
    if (!treeData) return;

    // 🔹 ApexTree Options
    const options = {
      contentKey: "data",
      width: 1000,
      height: 700,
      nodeWidth: 170,
      nodeHeight: 110,
      fontColor: "#fff",
      borderColor: "#333",
      childrenSpacing: 60,
      siblingSpacing: 30,
      direction: "top",
      enableExpandCollapse: true,
      enableToolbar: true,
      canvasStyle:
        "border:1px solid #ddd;background:#f6f6f6;border-radius:10px;",

      nodeTemplate: (content) => `
        <div style='display:flex;flex-direction:column;align-items:center;gap:8px;justify-content:center;height:100%;'>
          <img 
            src='${content.imageURL}' 
            alt='${content.name}' 
            style='width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid white;' 
          />
          <div style='font-weight:bold;font-family:Arial;font-size:13px;text-align:center;'>${content.name}</div>
          <div style='font-size:12px;opacity:0.8;'>${content.username}</div>
        </div>
      `,
    };

    // 🔹 Initialize ApexTree
    const treeInstance = new ApexTree(treeContainerRef.current, options);
    treeInstance.render(treeData);

    // 🔹 Cleanup on unmount
    return () => {
      if (treeInstance && treeInstance.destroy) treeInstance.destroy();
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Member Tree</h2>
      <div
        ref={treeContainerRef}
        id="svg-tree"
        style={{
          width: "100%",
          height: "700px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fafafa",
        }}
      />
    </div>
  );
};

export default Community;
