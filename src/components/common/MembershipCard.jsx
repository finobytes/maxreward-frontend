import React from "react";
import { userCardCenterLogo } from "../../assets/assets";
import { Wifi } from "lucide-react";

/**
 * Utility to pick the first valid string from arguments.
 */
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

/**
 * Formats a phone number or string into groups of 4 for a credit card look.
 * Example: "1234567890" -> "1234 5678 90" (approx)
 */
const formatCardNumber = (str) => {
  if (!str) return "•••• •••• •••• ••••";
  // Remove non-digits to be safe, or just space it out
  const clean = str.replace(/\D/g, "");
  // If it looks like a phone, maybe keep standard phone format?
  // User asked for "like debit or credit card", so spacing is key.
  // visual grouping: 4-4-4-4 or similar.
  const groups = clean.match(/.{1,4}/g);
  return groups ? groups.join(" ") : str;
};

/**
 * Formats a date string to MM/YY format (like credit card expiry dates).
 * Handles various input formats: ISO strings, timestamps, date objects.
 * Returns a fallback if the date is invalid or missing.
 */
const formatJoinDate = (dateInput) => {
  if (!dateInput) return "••/••";

  try {
    let date;

    // Handle different date input types
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string" || typeof dateInput === "number") {
      date = new Date(dateInput);
    } else {
      return "••/••";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "••/••";
    }

    // Format as MM/YY
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${month}/${year}`;
  } catch (error) {
    console.error("Error formatting join date:", error);
    return "••/••";
  }
};

const buildMembershipView = (data, role) => {
  const branding = data?.branding || {};
  const brandingType = branding?.type;
  const isMerchantRole = role === "merchant";
  const merchantInfo = data?.merchant || {};

  const memberName = pickFirst(
    data?.name,
    data?.user_name,
    data?.email,
    "MEMBER",
  );
  const memberPhone = pickFirst(
    data?.phone,
    merchantInfo?.phone,
    data?.user_name,
    "0000000000",
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
        "AUTHORIZED SIGNATURE",
      )
    : pickFirst(
        data?.name,
        data?.user_name,
        data?.email,
        "AUTHORIZED SIGNATURE",
      );

  return {
    titleName,
    showMaxReward,
    logoSrc: logoSrc || userCardCenterLogo,
    logoAlt: titleName || "Card Logo",
    memberPhone,
    rightText,
  };
};

const EmvChip = () => (
  <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 border border-yellow-600 shadow-md relative overflow-hidden">
    {/* Chip Circuit Lines */}
    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-yellow-800/40 -translate-y-1/2"></div>
    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-yellow-800/40 -translate-x-1/2"></div>
    <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 border border-yellow-800/40 rounded-[1px] -translate-x-1/2 -translate-y-1/2"></div>
    <div className="absolute top-1/2 left-0 w-2 h-[1px] bg-yellow-800/30"></div>
    <div className="absolute top-1/2 right-0 w-2 h-[1px] bg-yellow-800/30"></div>
  </div>
);

const MembershipCard = ({ data, role = "member" }) => {
  console.log("data", data?.created_at);
  const view = buildMembershipView(data, role);
  const formattedNumber = formatCardNumber(view.memberPhone);
  const formattedJoinDate = formatJoinDate(data?.created_at);

  return (
    <div className="w-full max-w-md mx-auto relative perspective-1000 group">
      {/* Card Container */}
      <div
        className="
          relative w-full aspect-[1.586/1] 
          bg-gradient-to-br from-brand-500 via-orange-600 to-red-700 
          text-white rounded-2xl shadow-2xl overflow-hidden
          border border-white/20
          transition-transform duration-500 hover:scale-[1.02] hover:shadow-brand-500/40
        "
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-yellow-500/20 rounded-full blur-3xl"></div>

        {/* Glass Sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>

        {/* Content Content - Flex Column */}
        <div className="relative h-full flex flex-col justify-between p-6 sm:p-7 z-10">
          {/* TOP ROW: Chip, Wifi, Logo */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4">
              <EmvChip />
              <Wifi className="w-6 h-6 text-white/50 rotate-90" />
            </div>

            {/* Logo Area */}
            <div className="flex flex-col items-end">
              <div className="h-10 sm:h-12 flex items-center justify-center p-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
                <img
                  src={view.logoSrc}
                  alt={view.logoAlt}
                  className="h-full w-auto object-contain max-w-[100px]"
                  onError={(e) => {
                    if (e.currentTarget.src !== userCardCenterLogo) {
                      e.currentTarget.src = userCardCenterLogo;
                    }
                  }}
                />
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/60 mt-1 uppercase">
                {view.showMaxReward ? "Max Reward" : "Membership"}
              </div>
            </div>
          </div>

          {/* MIDDLE / BOTTOM: Number & Name */}
          <div className="mt-auto">
            {/* Card Number */}
            <div className="mb-4">
              <div
                className="font-mono text-xl sm:text-2xl md:text-3xl tracking-widest text-white drop-shadow-md"
                style={{ wordSpacing: "0.2em" }}
              >
                {formattedNumber}
              </div>
              <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider mt-1 ml-1">
                Member ID
              </div>
            </div>

            {/* Bottom Row info */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[9px] sm:text-[10px] text-white/60 uppercase mb-0.5">
                  Card Holder
                </div>
                <div className="font-outfit font-medium text-sm sm:text-base md:text-lg tracking-wide uppercase truncate max-w-[200px]">
                  {view.rightText}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-wide mb-0.5">
                  Member Since
                </div>
                <div className="font-mono text-base sm:text-lg font-bold tracking-wider">
                  {formattedJoinDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
