import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

const Section = ({ title, children, isOpen: defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
      >
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
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

const TermsAndConditions = () => {
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
              Terms & Conditions
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
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Please read these terms carefully before ensuring your membership
            with Co-brand MaxReward.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1.0 */}
          <Section title="1.0 Definitions">
            <p>
              <strong className="text-gray-900">1.1</strong> In these Terms and
              Conditions “M3R” means M3 Rewards Sdn Bhd, while ‘Co-brand
              MaxReward’ is defined as a global digital consumer reward platform
              owned and managed by M3R.
            </p>
            <p>
              <strong className="text-gray-900">1.2</strong> “Co-brand
              MaxReward” allows each Affiliate Merchant to promote their own
              reward program along a single platform Terms & Conditions meaning
              a Co-brand MaxReward is accepted by Affiliate Merchant globally.
            </p>
            <p>
              <strong className="text-gray-900">1.3</strong> “Member” is defined
              as both Individual and Corporate unless otherwise specified.
            </p>
            <p>
              <strong className="text-gray-900">1.4</strong> The “Card” refers
              to the Co-brand MaxReward digital card, or any other designated
              card.
            </p>
            <p>
              <strong className="text-gray-900">1.5</strong> “Cardholder” refers
              to holders of a Card.
            </p>
            <p>
              <strong className="text-gray-900">1.6</strong> “Account” is
              defined as Member’s reward records.
            </p>
            <p>
              <strong className="text-gray-900">1.7</strong> “Membership” means
              that arrangement by which a member agrees to participate in the
              programme to receive reward points when purchasing qualifying
              goods and services from Affiliate Merchant and/or from Max
              Redemption Mall under these Terms and Conditions.
            </p>
            <p>
              <strong className="text-gray-900">1.8</strong> “Affiliate
              Merchant” refers to company or individual who have contractually
              agreed to supply qualifying goods and services in respect of
              which, points are rewarded on purchases made by Member.
            </p>
            <p>
              <strong className="text-gray-900">1.9</strong> “Max Redeem Mall”
              is our online portal where Member can redeem MaxPoints for
              Affiliate Merchant’s products or services.
            </p>
            <p>
              <strong className="text-gray-900">1.10</strong> “Suppliers” means
              products/ service provider or company/persons that are engaged by
              M3R to supply the products/ services.
            </p>
            <p>
              <strong className="text-gray-900">1.11</strong> “Business
              Partners” are defined as partners, suppliers, service suppliers,
              contractors, vendors, agencies, agents or persons, who are
              appointed by M3R for purposes of managing various aspects of the
              MaxReward programme.
            </p>
          </Section>

          {/* Section 2.0 */}
          <Section title="2.0 Co-brand Max Reward Programme">
            <p>
              <strong className="text-gray-900">2.1</strong> Co-brand MaxReward
              digital member card is not a credit card nor a debit card. No
              physical member card is issued. Member card is displayed on the
              home page.
            </p>
            <p>
              <strong className="text-gray-900">2.2</strong> We have 2 category
              of membership namely “Individual Member” and “Corporate Member”.
            </p>
            <div className="pl-4 border-l-2 border-gray-200 ml-2 space-y-2">
              <p>
                <strong className="text-gray-900">
                  2.2.1 Individual Member:
                </strong>{" "}
                Individual above legal age 18 with NRID must be referred by an
                Individual Member or a Corporate Member and membership is
                subject final approval by M3R.
              </p>
              <p>
                <strong className="text-gray-900">
                  2.5.1 Corporate Member:
                </strong>{" "}
                Company with ROC or individual, after approval as Affiliate
                Merchant shall automatically be a Corporate Member. New Member
                must be referred by a current Member.
              </p>
            </div>

            <h3 className="font-bold text-gray-900 pt-2">
              2.4 Membership Status & Upgrade
            </h3>
            <p>
              Daily at 9:00pm, a system run shall be conducted to upgrade
              Membership Status. Member with sufficient MaxPoints is
              automatically upgraded by deduction of respective number of points
              as per table below.
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Status Upgrade</th>
                    <th className="px-6 py-3">Points Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      1Star to 2Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      1,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      2Star to 3Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      2,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      3Star to 4Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      4,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      4Star to 5Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      7,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      6Star to 7Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      11,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      7Star to 8Star
                    </td>
                    <td className="px-6 py-3 text-brand-600 font-bold">
                      16,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              <strong className="text-gray-900">
                2.6.1.1 Referral Points:
              </strong>{" "}
              Calculation = Transaction Amount x AMRF x 20% x 100 Points
            </p>
            <p>
              <strong className="text-gray-900">
                2.6.1.2 Community Points:
              </strong>{" "}
              Calculation = Transaction Amount x AMRF x 50% x 100 Points.
              Rewarded to 30 uplink members.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
              <div className="bg-brand-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-200 uppercase">Gen 1-3</div>
                <div className="text-lg font-bold text-white">5%</div>
              </div>
              <div className="bg-brand-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-200 uppercase">Gen 4-6</div>
                <div className="text-lg font-bold text-white">15%</div>
              </div>
              <div className="bg-brand-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-200 uppercase">Gen 7-9</div>
                <div className="text-lg font-bold text-white">8%</div>
              </div>
              <div className="bg-brand-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-200 uppercase">Gen 11-20</div>
                <div className="text-lg font-bold text-white">1%</div>
              </div>
              <div className="bg-brand-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-200 uppercase">Gen 21-30</div>
                <div className="text-lg font-bold text-white">0.5%</div>
              </div>
            </div>
          </Section>

          {/* Section 3.0 Website */}
          <Section title="3.0 Website Terms">
            <p>
              This website,{" "}
              <span className="text-brand-500 font-medium">www.max15.my</span>{" "}
              is operated by M3R.
            </p>
            <p>
              Throughout the site, the terms “we”, “us” and “our” refer to M3R.
              M3R offers this website, including all information, tools and
              services available from this site to you, the user, conditioned
              upon your acceptance of all terms, conditions, policies and
              notices stated here.
            </p>
            <p>
              By visiting our site and/ or purchasing something from us, you
              engage in our “Service” and agree to be bound by the following
              terms and conditions (“Terms and Conditions”, “Terms”), including
              those additional terms and conditions and policies referenced
              herein and/or available by hyperlink.
            </p>
            <p>
              These Terms and Conditions apply to all users of the site,
              including without limitation users who are browsers, vendors,
              customers, merchants, and/ or contributors of content.
            </p>
          </Section>

          {/* Additional Sections Grouped for brevity but complete coverage concept */}
          <Section
            title="4.0 - 10.0 General Conditions & Services"
            defaultOpen={false}
          >
            <h3 className="font-bold text-gray-900 mt-2">
              4.0 General Conditions
            </h3>
            <p>
              We reserve the right to refuse service to anyone for any reason at
              any time. You understand that your content (not including credit
              card information), may be transferred unencrypted and involve (a)
              transmissions over various networks; and (b) changes to conform
              and adapt to technical requirements of connecting networks or
              devices.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              5.0 Accuracy of Information
            </h3>
            <p>
              We are not responsible if information made available on this site
              is not accurate, complete or current. The material on this site is
              provided for general information only.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              6.0 Modifications to Service
            </h3>
            <p>
              Prices for our products are subject to change without notice. We
              reserve the right at any time to modify or discontinue the Service
              (or any part or content thereof) without notice at any time.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              7.0 - 10.0 Products, Billing, Tools & Links
            </h3>
            <p>
              Certain products or services may be available exclusively through
              Max Redeem Mall. We generally reserve the right to limit sales,
              quantities, and refuse orders. We may provide access to
              third-party tools and links which we do not monitor or control.
            </p>
          </Section>

          <Section
            title="11.0 - 14.0 User Information & Prohibited Uses"
            defaultOpen={false}
          >
            <h3 className="font-bold text-gray-900 mt-2">11.0 User Comments</h3>
            <p>
              We may use any comments you forward to us without restriction.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              12.0 Personal Information
            </h3>
            <p>
              Your submission of personal information through the store is
              governed by our Privacy Policy.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              14.0 Prohibited Use
            </h3>
            <p>
              You are prohibited from using the site or its content: (a) for any
              unlawful purpose; (b) to solicit others to perform or participate
              in any unlawful acts; (c) to violate any regulations; (d) to
              infringe upon or violate our intellectual property rights or the
              intellectual property rights of others; (e) to harass, abuse,
              insult, harm, defame, slander, disparage, intimidate, or
              discriminate.
            </p>
          </Section>

          <Section title="15.0 Disclaimer of Warranties; Limitation of Liability">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-800 text-sm">
              <p className="mb-2 font-bold">IMPORTANT DISCLAIMER:</p>
              <p>
                We do not guarantee, represent or warrant that your use of our
                service will be uninterrupted, timely, secure or error-free. We
                do not warrant that the results that may be obtained from the
                use of the service will be accurate or reliable.
              </p>
              <p className="mt-2">
                In no case shall M3R, our directors, officers, employees,
                affiliates, agents, contractors, interns, suppliers, service
                providers or licensors be liable for any injury, loss, claim, or
                any direct, indirect, incidental, punitive, special, or
                consequential damages of any kind.
              </p>
            </div>
          </Section>

          <Section title="16.0 - 24.0 Legal Framework" defaultOpen={false}>
            <p>
              <strong className="text-gray-900">16.0 Indemnification:</strong>{" "}
              You agree to indemnify, defend and hold harmless M3R and our
              subsidiaries, affiliates, partners, officers, directors, agents,
              contractors, licensors, service providers, subcontractors,
              suppliers, interns and employees.
            </p>
            <p className="mt-2">
              <strong className="text-gray-900">17.0 Severability:</strong> If
              any provision is unlawful, it shall be severed without affecting
              the validity of other provisions.
            </p>
            <p className="mt-2">
              <strong className="text-gray-900">18.0 Termination:</strong> These
              Terms and Conditions are effective unless and until terminated by
              either you or us.
            </p>
            <p className="mt-2">
              <strong className="text-gray-900">21.0 Governing Law:</strong>{" "}
              These Terms and Conditions shall be governed by and construed in
              accordance with Malaysian law.
            </p>
            <p className="mt-2 text-brand-600 font-medium">
              Questions about the Terms and Conditions should be sent to us at
              info@max15.my
            </p>
          </Section>

          <div className="text-center pt-8 pb-4 text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} M3 Rewards Sdn Bhd. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
