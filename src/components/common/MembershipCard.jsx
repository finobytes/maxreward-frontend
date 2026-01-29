import React from "react";
import { userCardCenterLogo } from "../../assets/assets";

const pickFirst = (...values) => {
  for (const value of values) {
    if (value === 0) return "0";
    if (value !== null && value !== undefined) {
      const str = String(value).trim();
      if (str) return str;
    }
  }
  return "";
};

const buildMembershipView = (data, role) => {
  const branding = data?.branding || {};
  const brandingType = branding?.type;
  const isMerchantRole = role === "merchant";
  const merchantInfo = data?.merchant || {};

  const memberName = pickFirst(data?.name, data?.user_name, data?.email, "Member");
  const memberPhone = pickFirst(
    data?.phone,
    merchantInfo?.phone,
    data?.user_name,
    "N/A"
  );

  let titleName = memberName;
  let showMaxReward = false;

  if (isMerchantRole) {
    titleName = pickFirst(merchantInfo?.business_name, memberName);
  } else if (brandingType === "company") {
    titleName = pickFirst(branding?.name, memberName);
  } else if (brandingType === "merchant") {
    titleName = pickFirst(branding?.name, memberName);
    showMaxReward = true;
  }

  const logoSrc = isMerchantRole
    ? merchantInfo?.business_logo
    : branding?.logo_url || branding?.logoUrl || branding?.logo;

  const rightText = isMerchantRole
    ? pickFirst(
        merchantInfo?.business_name,
        data?.name,
        data?.user_name,
        data?.email,
        "N/A"
      )
    : pickFirst(data?.name, data?.user_name, data?.email, "N/A");

  const logoAlt = pickFirst(
    isMerchantRole ? merchantInfo?.business_name : branding?.name,
    memberName,
    "Membership logo"
  );

  return {
    titleName,
    showMaxReward,
    logoSrc: logoSrc || userCardCenterLogo,
    logoAlt,
    memberPhone,
    rightText,
  };
};

const MembershipCard = ({ data, role = "member" }) => {
  const view = buildMembershipView(data, role);
  const titleText = view.showMaxReward
    ? `${view.titleName} MAX REWARD`
    : view.titleName;

  return (
    <div className="w-full h-auto bg-[#735DFFB2] rounded-xl shadow-lg flex flex-col justify-between py-6">
      <h2
        className="font-bold text-center text-white leading-tight px-3 break-words"
        style={{
          fontSize: "clamp(1.5rem, 2vw + 0.5rem, 2rem)", // scales smoothly
        }}
        title={titleText}
      >
        {view.titleName}
        {view.showMaxReward && (
          <span className="text-brand-500"> MAX REWARD</span>
        )}
      </h2>
      <div className="flex flex-col justify-center items-center py-3">
        <img
          src={view.logoSrc}
          alt={view.logoAlt}
          className="h-14 w-auto object-contain"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            if (event.currentTarget.src !== userCardCenterLogo) {
              event.currentTarget.src = userCardCenterLogo;
            }
          }}
        />
      </div>
      <div className="bg-white flex justify-between items-center px-4 py-2 text-brand-500 font-bold text-lg sm:text-xl md:text-2xl">
        <span className="truncate max-w-[50%]" title={view.memberPhone}>
          {view.memberPhone}
        </span>
        <span className="truncate text-right max-w-[55%]" title={view.rightText}>
          {view.rightText}
        </span>
      </div>
    </div>
  );
};

export default MembershipCard;
