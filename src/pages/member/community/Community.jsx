import React, { useEffect, useRef } from "react";
import ApexTree from "apextree";
import { convertToApexTreeFormat } from "../../../utils/convertTreeData";
import { useGetReferralTreeQuery } from "../../../redux/features/member/referNewMember/referNewMemberApi";
import TreeSkeleton from "../../../components/skeleton/TreeSkeleton";
import ErrorMessage from "../../../components/errorMsg/ErrorMessage";

const Community = () => {
  const { data, isFetching, isLoading, error, isError, refetch } =
    useGetReferralTreeQuery();

  const treeContainerRef = useRef(null);
  console.log(treeContainerRef.data);

  useEffect(() => {
    if (!data) return;

    const treeData = convertToApexTreeFormat(data);
    if (!treeData) return;

    const container = treeContainerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;

    const options = {
      contentKey: "data",
      width: containerWidth, // Make width dynamic
      height: 800, // you can also use container.offsetHeight if needed
      nodeWidth: 170,
      nodeHeight: 150,
      childrenSpacing: 60,
      siblingSpacing: 30,
      enableExpandCollapse: true,
      enableToolbar: true,
      direction: "top",
      canvasStyle: "background:#ffffff;", // white background

      nodeTemplate: (content) => `
        <div style='display:flex;flex-direction:column;align-items:center;gap:6px;padding:4px;'>
          <img src='${content.imageURL}'
            style='width:45px;height:45px;border-radius:50%;border:2px solid white;'
          />
          <div style='font-weight:bold;font-size:13px;'>${content.name}</div>
          <div style='font-size:11px;opacity:0.7;'>${content.username}</div>
          <div style='font-size:11px;opacity:0.7;'>${content.position}</div>
        </div>
      `,
    };

    const instance = new ApexTree(container, options);
    instance.render(treeData);

    // Re-render on window resize (fully responsive)
    const handleResize = () => {
      instance.update({ width: container.offsetWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      instance.destroy?.();
    };
  }, [data]);

  if (isLoading || isFetching) return <TreeSkeleton />;
  if (isError) return <ErrorMessage onRetry={refetch} />;
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Member Tree</h2>

      {/* ✅ Responsive Scrollable Container */}
      <div
        ref={treeContainerRef}
        style={{
          width: "100%",
          height: "80vh",
          overflow: "auto", // scroll if content too wide
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff", // ✅ white background
        }}
      />
    </div>
  );
};

export default Community;
