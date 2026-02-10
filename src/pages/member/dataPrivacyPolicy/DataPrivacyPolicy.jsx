import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  Server,
  Globe,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router";

const Section = ({
  title,
  icon: Icon,
  children,
  isOpen: defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
      >
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-brand-500" />}
          {title}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed animate__animated animate__fadeIn animate__faster">
          {children}
        </div>
      )}
    </div>
  );
};

const DataPrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 font-outfit">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 backdrop-blur-md bg-white/80 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-500 transition-colors duration-200 group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-brand-50 transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-brand-500" />
            </div>
            <span className="font-medium text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-gray-900">
              Data Privacy Policy
            </h1>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Title Block */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-4 text-brand-500">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Respect for your privacy is coded into our DNA. We aspire to build
            our services with a set of strong privacy principles in mind.
          </p>
          <div className="mt-4 inline-block px-4 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
            Last modified: 15th November 2022
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-gray-600 leading-relaxed">
            <p className="mb-4">
              MaxReward provides INFORMATION services to users around the world.
              Our Privacy Policy helps explain our information practices. When
              we say “MaxReward”, “our”, “we”, or “us,” we are talking about
              MaxReward.
            </p>
            <p>
              MaxReward, a global digital customer reward platform, is solely
              owned and managed by M3 Rewards Sdn Bhd. This Privacy Policy
              (“Privacy Policy”) applies to all website, mobile apps, services,
              features and software (together, hereinafter referred to as
              “Services”) unless specified otherwise.
            </p>
          </div>

          <Section title="Information We Collect" icon={Eye} isOpen={true}>
            <p>
              MaxReward receives or collects information when we operate and
              provide our Services, including when you install, access, or use
              our Services.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Information You Provide
            </h3>
            <p>
              Your Account Information consist of information that you have
              provided us in your personal profile, when making a transaction,
              details of referee and information when you use our Services. You
              confirm you are authorized to provide us such names and numbers.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">Customer Support</h3>
            <p>
              You may provide us with information related to your use of our
              Services, including copies of your messages, and how to contact
              you so we can provide you customer support. For example, you may
              send us an email with information relating to our app performance
              or other issues.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Automatically Collected Information
            </h3>
            <p>
              <strong>Usage and Log Information.</strong> We collect
              service-related, diagnostic, and performance information. This
              includes information about your activity (such as how you use our
              Services, how you interact with other user using our Services, and
              the like), log files, and diagnostic, crash, website, and
              performance logs and reports.
            </p>
            <p className="mt-2">
              <strong>Transactional Information.</strong> If you pay for our
              Services, we may receive information and confirmations, such as
              payment receipts, including from app stores or other third parties
              processing your payment.
            </p>
            <p className="mt-2">
              <strong>Device and Connection Information.</strong> We collect
              device-specific information when you install, access, or use our
              Services. This includes information such as hardware model,
              operating system information, browser information, IP address,
              mobile network information including phone number, internet
              cookies, and device identifiers.
            </p>
            <p className="mt-2">
              We collect device location information if you use our location
              features.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">Cookies</h3>
            <p>
              We use cookies to operate and provide our Services, including to
              provide our Services that are web-based, improve your experiences,
              understand how our Services are being used, and customize our
              Services.
            </p>
          </Section>

          <Section title="Third-Party Information" icon={Server}>
            <h3 className="font-bold text-gray-900">
              Information Others Provide About You
            </h3>
            <p>
              We receive information other people provide us, which may include
              information about you. For example, when other users you know use
              our Services, they may provide your phone number from their mobile
              address book (just as you may provide theirs).
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Third-Party Providers
            </h3>
            <p>
              We work with third-party providers to help us operate, provide,
              improve, understand, customize, support, and market our Services.
              These providers may provide us information about you in certain
              circumstances; for example, app stores may provide us reports to
              help us diagnose and fix service issues.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Third-Party Services
            </h3>
            <p>
              We allow you to use our Services in connection with third-party
              services. If you use our Services with such third-party services,
              we may receive information about you from them. Please note that
              when you use third-party services, their own terms and privacy
              policies will govern your use of those services.
            </p>
          </Section>

          <Section title="How We Use Information" icon={Shield}>
            <p>
              We use all the information we have to help us operate, provide,
              improve, understand, customize, support, and market our Services.
            </p>
            <h3 className="font-bold text-gray-900 mt-4">Our Services</h3>
            <p>
              We operate and provide our Services, including providing customer
              support, and improving, fixing, and customizing our Services. We
              understand how people use our Services, and verify accounts and
              activity.
            </p>
            <h3 className="font-bold text-gray-900 mt-4">
              Safety and Security
            </h3>
            <p>
              We verify accounts and activity, and promote safety and security
              on and off our Services, such as by investigating suspicious
              activity or violations of our Terms, and to ensure our Services
              are being used legally.
            </p>
          </Section>

          <Section title="Information Sharing" icon={Globe}>
            <p>
              You share your information as you use our Services, and we share
              your information to help us operate, provide, improve, understand,
              customize, support, and market our Services.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Account Information:</strong> Your phone number, profile
                name and photo may be available to anyone who uses our Services.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We work with
                third-party Service Providers to help us operate our Services.
              </li>
            </ul>
            <p className="mt-4">
              When you use third-party services that are integrated with our
              Services, they may receive information about what you share with
              them.
            </p>
          </Section>

          <Section title="Data Management & Retention" icon={Server}>
            <h3 className="font-bold text-gray-900">
              Retention of Your Information
            </h3>
            <p>
              We will only retain your personal data and information for as long
              as we deem necessary to fulfil the purpose(s) for which it was
              collected for or to comply with any legal requirements.
              Subsequently, we will destroy or permanently delete your personal
              data from our database.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Managing Your Information
            </h3>
            <p>
              If there are any changes to your personal data or if you believe
              that the personal data we have about you is inaccurate,
              incomplete, misleading or not up-to-date, please contact us.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Deleting Your MaxReward Account
            </h3>
            <p>
              You may delete your MaxReward account at any time. When you delete
              your MaxReward account, your undelivered messages may not be
              instantly deleted from our servers.
            </p>
          </Section>

          <Section title="Legal & Corporate" icon={Lock}>
            <h3 className="font-bold text-gray-900">Affiliated Companies</h3>
            <p>
              We are part of the M3 Rewards Sdn Bhd eco-system. MaxReward
              receives information from, and shares information with, this
              eco-system and family of companies.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Assignment & Transfer
            </h3>
            <p>
              All of our rights and obligations under our Privacy Policy are
              freely assignable by us to any of our affiliates, in connection
              with a merger, acquisition, restructuring, or sale of assets.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">Law And Protection</h3>
            <p>
              We may collect, use, preserve, and share your information if we
              believe that it is reasonably necessary to respond pursuant to
              applicable law or regulations.
            </p>
          </Section>

          <Section title="Global Operations & Updates" icon={Globe}>
            <h3 className="font-bold text-gray-900">Our Global Operations</h3>
            <p>
              You agree to our information practices, including the collection,
              use, processing, and sharing of your information as described in
              this Privacy Policy, as well as the transfer and processing of
              your information in Malaysia and other countries globally.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              Updates To Our Policy
            </h3>
            <p>
              We may amend or update our Privacy Policy. Your continued use of
              our Services confirms your acceptance of our Privacy Policy, as
              amended.
            </p>
          </Section>

          <div className="bg-brand-50 rounded-xl p-6 border border-brand-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-gray-200 flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-500" />
                Contact Us
              </h3>
              <p className="text-gray-200 text-sm mt-1">
                If you need to contact us regarding your data privacy.
              </p>
            </div>
            <a
              href="mailto:support@max15.my"
              className="bg-white text-brand-600 hover:bg-brand-600 hover:text-white px-5 py-2.5 rounded-lg border border-brand-200 hover:border-brand-600 font-medium transition-all duration-200 text-sm shadow-sm"
            >
              support@max15.my
            </a>
          </div>

          <div className="text-center pt-8 pb-4 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} M3 Rewards Sdn Bhd. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyPolicy;
