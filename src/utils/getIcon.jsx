import {
  Bell,
  Gift,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Lock,
  Award,
  ShoppingBag,
} from "lucide-react";

export const getIcon = (type) => {
  switch (type) {
    case "referral_points_earned":
      return <UserPlus className="text-blue-500" size={18} />;
    case "community_points_earned":
      return <Star className="text-yellow-500" size={18} />;
    case "point_approval":
      return <CheckCircle className="text-green-500" size={18} />;
    case "purchase_approved":
      return <ShoppingBag className="text-green-500" size={18} />;
    case "purchase_rejected":
      return <XCircle className="text-red-500" size={18} />;
    case "cp_unlock":
      return <Lock className="text-indigo-500" size={18} />;
    case "referral_invite":
      return <UserPlus className="text-cyan-500" size={18} />;
    case "redemption":
      return <DollarSign className="text-green-500" size={18} />;
    case "milestone":
      return <Award className="text-purple-500" size={18} />;
    case "voucher_purchase":
      return <Gift className="text-pink-500" size={18} />;
    case "level_unlocked":
      return <Star className="text-amber-500" size={18} />;
    case "system_alert":
      return <AlertTriangle className="text-orange-500" size={18} />;
    default:
      return <Bell className="text-gray-400" size={18} />;
  }
};
