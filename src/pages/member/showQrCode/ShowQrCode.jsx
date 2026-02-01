import React from "react";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import QRCode from "react-qr-code";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Download, Share2, User, QrCode as QrIcon } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import { toast } from "sonner";

const ShowQrCode = () => {
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member";
  const { data, isLoading, error } = useVerifyMeQuery(role, { skip: !token });

  const userData = data?.data || data;

  // Data to encode in QR
  // For production, this might be a unique URL or a specific identifier
  // Create a permalink for the QR code
  // This allows "Google Scanner" (native camera) to recognize it as a link
  const origin = window.location.origin;
  const qrValue = userData?.user_name
    ? `${origin}/public-referral?ref=${userData.user_name}`
    : "N/A";

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${userData?.name || "Member"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded successfully!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Max Reward QR Code",
          text: `Scan my QR code to verify my membership: ${userData?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      toast.info("Sharing is not supported on this browser.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Skeleton className="h-64 w-64 rounded-xl" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-full inline-block">
            <QrIcon size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Failed to load QR Code
          </h2>
          <p className="text-gray-500 max-w-sm">
            We couldn't retrieve your profile information. Please try again
            later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-50 rounded-full blur-3xl opacity-50" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in duration-500">
        {/* <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-600" /> */}
        {/* <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <QrIcon className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            My Global ID Card
          </CardTitle>
          <CardDescription>Scan to identify your membership</CardDescription>
        </CardHeader> */}

        <CardContent className="flex flex-col items-center gap-8 py-8">
          {/* QR Container */}
          <div className="relative p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <QRCode
              id="qr-code-svg"
              size={240}
              value={qrValue}
              level="H"
              fgColor="#111827"
              bgColor="transparent"
            />
            {/* Name/Logo Overlay in center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-gray-50 flex items-center justify-center min-w-[60px]">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider truncate max-w-[80px]">
                {userData?.name?.split(" ")[0] || "USER"}
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              {userData?.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <User size={14} className="text-brand-500" />
              Member ID:{" "}
              <span className="font-mono font-medium text-gray-700">
                {userData?.id}
              </span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4 pb-8">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-brand-600 hover:bg-brand-700 h-12 rounded-xl text-white font-semibold transition-all active:scale-95 shadow-lg shadow-brand-200"
          >
            <Download size={18} className="mr-2" />
            Download
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-gray-200 text-gray-700 font-semibold transition-all active:scale-95 hover:bg-gray-50"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-8 text-sm text-gray-400 font-medium">
        Max Reward Membership Identification
      </p>
    </div>
  );
};

export default ShowQrCode;
