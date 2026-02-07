import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

const Section = ({ title, children, isOpen: defaultOpen = false }) => {
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
            Co-brand MaxReward Member Terms & Conditions
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Please read these terms carefully before ensuring your membership
            with Co-brand MaxReward.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1.0 */}
          <Section title="1.0 Definitions" isOpen={true}>
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
          <Section title="2.0 Co-brand MaxReward programme" isOpen={true}>
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
                  2.2.2 Corporate Member:
                </strong>{" "}
                Company with ROC or individual, after approval as Affiliate
                Merchant shall automatically be a Corporate Member.
              </p>
            </div>
            <p>
              <strong className="text-gray-900">2.3</strong> New Member must be
              referred by a current Member. There is no limit to the number of
              new members referred. M3R may refuse membership application and
              reserves the absolute right not to disclose the reasons for such
              refusal.
            </p>
            <p>
              <strong className="text-gray-900">
                2.4 Affiliate Merchant Reward Fee (AMRF):
              </strong>{" "}
              AMRF is the fee that a Merchant contractually agrees to pay to M3R
              to manage and fund the Points to reward Members for buying their
              products/ services. AMRF varies from Merchant to Merchant.
            </p>

            <h3 className="font-bold text-gray-900 pt-2">
              2.5 Membership Status & Upgrade
            </h3>
            <p>
              <strong className="text-gray-900">2.5.1</strong> Daily at 9:00pm,
              a system run shall be conducted to upgrade Membership Status.
              Member with sufficient MaxPoints is automatically upgraded by
              deduction of respective number of points as per table on the
              right.
            </p>
            <p>
              <strong className="text-gray-900">2.5.2</strong> The benefit of
              status upgrade is that the member qualifies to be rewarded
              ReferralPoints & CommunityPoints from downlink members with
              similar status and/ or lower status.
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg mt-4">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Status Upgrade</th>
                    <th className="px-6 py-3">MaxPoints</th>
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

            <h3 className="font-bold text-gray-900 pt-4">2.6 Reward Points</h3>
            <p>
              <strong className="text-gray-900">2.6.1</strong> Member are
              rewarded 2 types of Points namely Referral Points & Community
              Points.
            </p>
            <p>
              <strong className="text-gray-900">2.6.1.1 ReferralPoints:</strong>{" "}
              Referral Points = Transaction Amount x AMRF x 20% x 100 Points
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-500">
              <li>
                Example 1: Referred Member purchase/redeem Product worth
                RM100.00 from AM with AMRF of 10%. Referral Points = RM100 x 10%
                x 20% x 100 Points = 200 Points.
              </li>
              <li>
                Example 2: Referred Member purchase/redeem Product worth
                RM100.00 from AM with AMRF of 5%. Referral Points = RM100 x 5% x
                20% x 100 Points = 100 Points.
              </li>
            </ul>

            <p className="mt-4">
              <strong className="text-gray-900">
                2.6.1.2 CommunityPoints:
              </strong>
            </p>
            <p>Step 1: Determine Total Community Points (TCP)</p>
            <p className="text-sm bg-gray-50 p-2 rounded border border-gray-100 italic">
              Total Community Points = Transaction Amount x AMRF x 50% x 100
              Points
            </p>
            <p className="mt-2">
              Step 2: Based on the TCP derived from a member’s purchase,
              Community Points are rewarded to 30 uplink members as per table
              below. The 1st uplink member is Gen1, the 2nd uplink member is Gen
              2 and so on till Gen 30.
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg mt-2">
              <table className="w-full text-sm text-left whitespace-nowrap text-center">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-2 border-r border-gray-200">
                      Generation
                    </th>
                    <th className="px-4 py-2 border-r border-gray-200">1-3</th>
                    <th className="px-4 py-2 border-r border-gray-200">4-6</th>
                    <th className="px-4 py-2 border-r border-gray-200">
                      7 to 9
                    </th>
                    <th className="px-4 py-2 border-r border-gray-200">
                      11 to 20
                    </th>
                    <th className="px-4 py-2">21 to 30</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-4 py-2 border-r border-gray-200 font-medium text-gray-900">
                      % of TCP
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200 font-bold text-brand-600">
                      5%
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200 font-bold text-brand-600">
                      15%
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200 font-bold text-brand-600">
                      8%
                    </td>
                    <td className="px-4 py-2 border-r border-gray-200 font-bold text-brand-600">
                      1%
                    </td>
                    <td className="px-4 py-2 font-bold text-gray-200">0.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-gray-900 pt-4">
              2.7 Available Points (AP) & On-hold Points (OP)
            </h3>
            <p>
              <strong>Available Points</strong> are Points that a member can
              redeem from AM and/or Max Redeem Mall.
            </p>
            <p>
              <strong>On-hold Points</strong> are Points that is kept and shall
              be released as Available Points when a member refers new members.
              Hence it is advisable to refer 5 members as soon as possible.
            </p>
            <p className="mt-2">
              Community Points rewarded to a member are credited as AP or OP
              under the following terms and conditions as per table below;
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg mt-2">
              <table className="w-full text-xs text-center whitespace-nowrap">
                <thead className="bg-gray-50 uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2 border-r border-gray-200">
                      No. of Members referred
                    </th>
                    <th className="px-3 py-2 border-r border-gray-200">ZERO</th>
                    <th className="px-3 py-2 border-r border-gray-200">1</th>
                    <th className="px-3 py-2 border-r border-gray-200">2</th>
                    <th className="px-3 py-2 border-r border-gray-200">3</th>
                    <th className="px-3 py-2 border-r border-gray-200">4</th>
                    <th className="px-3 py-2">5</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 border-r border-gray-200 font-medium text-left">
                      AP from generation
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      1 to 5
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      1 to 10
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      1 to 15
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      1 to 20
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      1 to 25
                    </td>
                    <td className="px-3 py-2 font-bold text-green-600">
                      1 to 30
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-r border-gray-200 font-medium text-left">
                      OHP from generation
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      6 to 30
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      11 to 30
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      16 to 30
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      21 to 50
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      26 to 30
                    </td>
                    <td className="px-3 py-2 font-bold text-gray-400">NIL</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <p>
                <strong>2.7.1</strong> When a member did not refer any member,
                the CommunityPoints from Gen 1 to Gen 5 are credited as AP while
                the CommunityPoints from Gen 6 to Gen 30 are credited as OP.
              </p>
              <p>
                <strong>2.7.2</strong> Immediately after a member referred 1
                member, the OH Points prior credit up to Gen 10 shall be
                credited as AP and henceforth the CommunityPoints from Gen 1 to
                Gen 10 are credited as AP while the CommunityPoints from Gen 11
                to Gen 30 are credited as OP.
              </p>
              <p>
                <strong>2.7.3</strong> Immediately after a member referred 2
                members, the OH Points prior credit up to Gen 15 shall be
                credited as AP and henceforth the CommunityPoints from Gen 1 to
                Gen 15 are credited as AP while the CommunityPoints from Gen 16
                to Gen 30 are credited as OP.
              </p>
              <p>
                <strong>2.7.4</strong> Immediately after a member referred 3
                members, the OH Points prior credit up to Gen 20 shall be
                credited as AP and henceforth the CommunityPoints from Gen 1 to
                Gen 20 are credited as AP while the CommunityPoints from Gen 21
                to Gen 30 are credited as OP.
              </p>
              <p>
                <strong>2.7.5</strong> Immediately after a member referred 4
                members, the OH Points prior credit up to Gen 25 shall be
                credited as AP and henceforth the CommunityPoints from Gen 1 to
                Gen 25 are credited as AP while the CommunityPoints from Gen 26
                to Gen 30 are credited as OP.
              </p>
              <p>
                <strong>2.7.6</strong> Immediately after a member referred 5
                members, the OH Points prior credit from up to Gen 25 shall be
                credited as AP and henceforth the CommunityPoints from Gen 1 to
                Gen 30 are credited as AP.
              </p>
            </div>

            <h3 className="font-bold text-gray-900 pt-4">
              Other Important Terms
            </h3>
            <p>
              <strong className="text-gray-900">
                2.8 Life time membership. Reregistration STRICTLY NOT ALLOWED:
              </strong>{" "}
              Each individual/ company can only register for one Member account.
              Once registered there is no option to re-register.
            </p>
            <p>
              <strong className="text-gray-900">2.9</strong> Member has the
              absolute right to decline /cancel /terminate the membership. In so
              doing, the person shall be permanently ban from re-joining
              MaxReward.
            </p>
            <p>
              <strong className="text-gray-900">2.10</strong> M3R may not
              approve a new member/terminate a member without notice for any of
              the following reasons;
              <br />
              2.10.1 Supply any misleading information or makes any
              misrepresentations to M3R or to any Partner in connection with
              MaxReward; or
              <br />
              2.10.2 Abuses any privilege accorded to the Member under the
              programme; or
              <br />
              2.10.3 Engages in any fraudulent activities under the programme;
              or
              <br />
              2.10.4 Found guilty of any crime in a court of law; or
              <br />
              2.10.5 Suspect to be a terrorist against humanity.
              <br />
              2.10.6 In event of membership not approved or terminated, the
              individual/member cannot seek redress of any kind in any court of
              law.
            </p>
            <p>
              <strong className="text-gray-900">
                2.11 Points rewarded do not expire.
              </strong>{" "}
              Points that are not redeemed over a certain period may be
              subjected to certain Tax law in the country of operation. M3R
              shall exercise full discretion to manage the tax situation in the
              best interest of Members.
            </p>
            <p>
              <strong className="text-gray-900">2.12 A service fee</strong> of
              50 Points shall be charged for each recovery/change of login
              password & pin.
            </p>
            <p>
              <strong className="text-gray-900">
                2.13 Monthly Member Management Fee:
              </strong>{" "}
              The Monthly Member Management Fee is 100 Points and is
              automatically redeemed from Member’s Available Points on the 1st
              of each month.
            </p>
            <p>
              <strong className="text-gray-900">
                2.14 Member’s Points statement
              </strong>{" "}
              reports how a member is being rewarded. Available Points is
              universal and can be used for redemption in any country subject to
              Currency/Point conversion rate at time of redemption.
            </p>
            <p>
              <strong className="text-gray-900">2.15</strong> By accessing our
              website and using our program, the Member is deemed to have agreed
              to abide and be bound by these Terms and Conditions which shall
              vary from time to time.
            </p>
          </Section>

          {/* Section 3.0 Website */}
          <Section title="3.0 Website">
            <p>
              <strong className="text-gray-900">3.1</strong> This website,{" "}
              <span className="text-brand-500 font-medium">www.max15.my</span>{" "}
              is operated by M3R. Throughout the site, the terms “we”, “us” and
              “our” refer to M3R. M3R offers this website, including all
              information, tools and services available from this site to you,
              the user.
            </p>
            <p>
              <strong className="text-gray-900">3.2</strong> By visiting our
              site, you agree to be bound by the terms and conditions (“Terms
              and Conditions”, “Terms”), including those additional terms and
              conditions and policies referenced herein and/or available by
              hyperlink. These Terms and Conditions apply to all users of the
              site, including without limitation users who are browsers,
              vendors, customers, merchants, and/ or contributors of content.
            </p>
            <p>
              <strong className="text-gray-900">3.3</strong> Please read these
              Terms and Conditions carefully before accessing or using our
              website. By accessing or using any part of the site, you agree to
              be bound by these Terms and Conditions. If you do not agree to all
              the terms and conditions of this agreement, then you may not
              access the website or use any of our services. If these Terms and
              Conditions are considered an offer, acceptance is expressly
              limited to these Terms and Conditions.
            </p>
            <p>
              <strong className="text-gray-900">3.4</strong> This website that
              you are currently viewing is the latest updated version and shall
              supersede all previous versions. We reserve the right to update,
              change or replace any part of these Terms and Conditions by
              posting updates and/or changes to our website. It is your
              responsibility to check this page periodically for changes. Your
              continued use of or access to the website following the posting of
              any changes constitutes acceptance of those changes.
            </p>
            <p>
              <strong className="text-gray-900">3.5</strong> By agreeing to
              these Terms and Conditions, you represent that you are at least
              the age of majority in your state or province of residence, or
              that you are the age of majority in your state or province of
              residence and you have given us your consent to use this site.
            </p>
            <p>
              <strong className="text-gray-900">3.6</strong> You may not use our
              products for any illegal or unauthorized purpose nor may you, in
              the use of the Service, violate any laws in your jurisdiction
              (including but not limited to copyright laws).
            </p>
            <p>
              <strong className="text-gray-900">3.7</strong> You must not
              transmit any worms or viruses or any code of a destructive nature.
            </p>
            <p>
              <strong className="text-gray-900">3.8</strong> A breach or
              violation of any of the Terms will result in an immediate
              termination of your membership.
            </p>
          </Section>

          {/* Section 4.0 - 6.0 General Conditions & Services */}
          <Section title="4.0 - 6.0 General Conditions & Information Accuracy">
            <h3 className="font-bold text-gray-900 mt-2">
              4.0 General Conditions
            </h3>
            <p>
              <strong className="text-gray-900">4.1</strong> We reserve the
              right to refuse service to anyone for any reason at any time. You
              understand that your content (not including credit card
              information), may be transferred unencrypted and involve; (a)
              transmissions over various networks; and (b) changes to conform
              and adapt to technical requirements of connecting networks or
              devices. Credit card information is always encrypted during
              transfer over networks.
            </p>
            <p>
              <strong className="text-gray-900">4.2</strong> You agree not to
              reproduce, duplicate, copy, sell, resell or exploit any portion of
              the Service, use of the Service, or access to the Service or any
              contact on the website through which the service is provided,
              without express written permission by us.
            </p>
            <p>
              <strong className="text-gray-900">4.3</strong> The headings used
              in this agreement are included for convenience only and will not
              limit or otherwise affect these Terms.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              5.0 Accuracy of Information
            </h3>
            <p>
              <strong className="text-gray-900">5.1</strong> We are not
              responsible if information made available on this site is not
              accurate, complete or current. The material on this site is
              provided for general information only and should not be relied
              upon or used as the sole basis for making decisions without
              consulting primary, more accurate, more complete or timelier
              sources of information. Any reliance on the material on this site
              is at your own risk.
            </p>
            <p>
              <strong className="text-gray-900">5.2</strong> This site may
              contain certain historical information. Historical information,
              necessarily, is not current and is provided for your reference
              only. We reserve the right to modify the contents of this site at
              any time, but we have no obligation to update any information on
              our site. You agree that it is your responsibility to monitor
              changes to our site.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              6.0 Modification to the Service and Prices
            </h3>
            <p>
              <strong className="text-gray-900">6.1</strong> Prices for our
              products are subject to change without notice.
            </p>
            <p>
              <strong className="text-gray-900">6.2</strong> We reserve the
              right at any time to modify or discontinue the Service (or any
              part or content thereof) without notice at any time.
            </p>
            <p>
              <strong className="text-gray-900">6.3</strong> We shall not be
              liable to you or to any third-party for any modification, price
              change, suspension or discontinuance of the Service.
            </p>
          </Section>

          {/* Section 7.0 - 9.0 Products, Billing & Tools */}
          <Section title="7.0 - 9.0 Products, Billing & Optional Tools">
            <h3 className="font-bold text-gray-900 mt-2">
              7.0 Products or Services where applicable
            </h3>
            <p>
              <strong className="text-gray-900">7.1</strong> Certain products or
              services may be available exclusively through Max Redeem Mall.
              These products or services may have limited quantities and are
              subject to return or exchange only according to our Return Policy.
            </p>
            <p>
              <strong className="text-gray-900">7.2</strong> We have made every
              effort to display as accurately as possible the colours and images
              of our products that appear at the store. We cannot guarantee that
              your computer monitor’s display of any colour will be accurate.
            </p>
            <p>
              <strong className="text-gray-900">7.3</strong> We reserve the
              right, but are not obligated, to limit the sales of our products
              or Services to any person, geographic region or jurisdiction. We
              may exercise this right on a case-by-case basis. We reserve the
              right to limit the quantities of any products or services that we
              offer. All descriptions of products or product pricing are subject
              to change at any time without notice, at the sole discretion of
              us. We reserve the right to discontinue any product at any time.
              Any offer for any product or service made on this site is void
              where prohibited.
            </p>
            <p>
              <strong className="text-gray-900">7.4</strong> We do not warrant
              that the quality of any products, services, information, or other
              material purchased or obtained by you will meet your expectations,
              or that any errors in the Service will be corrected.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              8.0 Accuracy of Billing and Account Information
            </h3>
            <p>
              <strong className="text-gray-900">8.1</strong> We reserve the
              right to refuse any order you place with us. We may, in our sole
              discretion, limit or cancel quantities purchased per person, per
              household or per order. These restrictions may include orders
              placed by or under the same member account, the same credit card,
              and/or orders that use the same billing and/or shipping address.
              In the event that we make a change to or cancel an order, we may
              attempt to notify you by contacting the e-mail and/or billing
              address/phone number provided at the time the order was made. We
              reserve the right to limit or prohibit orders.
            </p>
            <p>
              <strong className="text-gray-900">8.2</strong> You agree to
              provide current, complete and accurate account information for all
              redemption made at Max Redeem Mall. You agree to promptly update
              your account and other information, including your email address
              and credit card numbers and expiration dates, so that we can
              complete your transactions and contact you as needed.
            </p>
            <p>
              <strong className="text-gray-900">8.3</strong> For more detail,
              please review our Returns Policy.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">9.0 Optional Tools</h3>
            <p>
              <strong className="text-gray-900">9.1</strong> We may provide you
              with access to third-party tools over which we do not monitor,
              control or input. You acknowledge and agree that we provide access
              to such tools without any warranties, representations or
              conditions of any kind and without any endorsement. We shall have
              no liability whatsoever arising from or relating to your use of
              optional third-party tools.
            </p>
            <p>
              <strong className="text-gray-900">9.2</strong> Any use by you of
              optional tools offered through this site is entirely at your own
              risk and discretion and you should ensure that you are familiar
              with and approve of the terms on which tools are provided by the
              relevant third-party provider(s).
            </p>
          </Section>

          {/* Section 10.0 - 11.0 Third-Party & User Comments */}
          <Section title="10.0 - 11.0 Third-Party Links & Comments">
            <h3 className="font-bold text-gray-900 mt-2">
              10.0 Third-Party Links
            </h3>
            <p>
              <strong className="text-gray-900">10.1</strong> Certain content,
              products and services available via our Service may include
              materials from third-parties.
            </p>
            <p>
              <strong className="text-gray-900">10.2</strong> Third-party links
              on this site may direct you to third-party websites that are not
              affiliated with us. We are not responsible for examining or
              evaluating the content or accuracy and we do not warrant and will
              not have any liability or responsibility for any third-party
              materials or websites, or for any other materials, products, or
              services of third-parties.
            </p>
            <p>
              <strong className="text-gray-900">10.3</strong> We are not liable
              for any harm or damages related to the purchase or use of goods,
              services, resources, content, or any other transactions made in
              connection with any third-party websites. Please review carefully
              the third-party’s policies and practices and make sure you
              understand them before you engage in any transaction. Complaints,
              claims, concerns, or questions regarding third-party products
              should be directed to the third-party.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              11.0 User Comment, Feedback and Other Submissions
            </h3>
            <p>
              <strong className="text-gray-900">11.1</strong> If, at our
              request, you send certain specific submissions (for example
              contest entries) or without a request from us you send creative
              ideas, suggestions, proposals, plans, or other materials, whether
              online, by email, by postal mail, or otherwise (collectively,
              ‘comments’), you agree that we may, at any time, without
              restriction, edit, copy, publish, distribute, translate and
              otherwise use in any medium any comments that you forward to us.
              We are and shall be under no obligation (a) to maintain any
              comments in confidence; (b) to pay compensation for any comments;
              or (c) to respond to any comments.
            </p>
            <p>
              <strong className="text-gray-900">11.2</strong> We may, but have
              no obligation to, monitor, edit or remove content that we
              determine in our sole discretion are unlawful, offensive,
              threatening, libellous, defamatory, pornographic, obscene or
              otherwise objectionable or violates any party’s intellectual
              property or these Terms and Conditions.
            </p>
            <p>
              <strong className="text-gray-900">11.3</strong> You agree that
              your comments will not violate any right of any third-party,
              including copyright, trademark, privacy, personality or other
              personal or proprietary right. You further agree that your
              comments will not contain libellous or otherwise unlawful, abusive
              or obscene material, or contain any computer virus or other
              malware that could in any way affect the operation of the Service
              or any related website. You may not use a false e-mail address,
              pretend to be someone other than yourself, or otherwise mislead us
              or third-parties as to the origin of any comments. You are solely
              responsible for any comments you make and their accuracy. We take
              no responsibility and assume no liability for any comments posted
              by you or any third-party.
            </p>
          </Section>

          {/* Section 12.0 - 14.0 Personal Info & Prohibited Use */}
          <Section title="12.0 - 14.0 Personal Info, Errors, & Prohibited Use">
            <h3 className="font-bold text-gray-900 mt-2">
              12.0 Personal Information
            </h3>
            <p>
              Your submission of personal information through the store is
              governed by our Privacy Policy. Click here to view our Privacy
              Policy.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              13.0 Errors, Inaccuracies and Omissions
            </h3>
            <p>
              <strong className="text-gray-900">13.1</strong> Occasionally there
              may be information on our site or in the Service that contains
              typographical errors, inaccuracies or omissions that may relate to
              product descriptions, pricing, promotions, offers, product
              shipping charges, transit times and availability. We reserve the
              right to correct any errors, inaccuracies or omissions, and to
              change or update information or cancel orders if any information
              in the Service or on any related website is inaccurate at any time
              without prior notice (including after you have submitted your
              order).
            </p>
            <p>
              <strong className="text-gray-900">13.2</strong> We undertake no
              obligation to update, amend or clarify information in the Service
              or on any related website, including without limitation, pricing
              information, except as required by law. No specified update or
              refresh date applied in the Service or on any related website,
              should be taken to indicate that all information in the Service or
              on any related website has been modified or updated.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              14.0 Prohibited Use
            </h3>
            <p>
              In addition to other prohibitions as set forth in the Terms and
              Conditions, you are prohibited from using the site or its content:
              for any unlawful purpose;
              <br />
              14.1 to solicit others to perform or participate in any unlawful
              acts;
              <br />
              14.2 to violate any international, federal, provincial or state
              regulations, rules, laws, or local ordinances;
              <br />
              14.3 to infringe upon or violate our intellectual property rights
              or the intellectual property rights of others;
              <br />
              14.4 to harass, abuse, insult, harm, defame, slander, disparage,
              intimidate, or discriminate based on gender, sexual orientation,
              religion, ethnicity, race, age, national origin, or disability;
              <br />
              14.5 to submit false or misleading information;
              <br />
              14.6 to upload or transmit viruses or any other type of malicious
              code that will or may be used in any way that will affect the
              functionality or operation of the Service or of any related
              website, other websites, or the Internet;
              <br />
              14.7 to collect or track the personal information of others;
              <br />
              14.8 to spam, phish, pharm, pretext, spider, crawl, or scrape;
              <br />
              14.9 for any obscene or immoral purpose; or
              <br />
              14.10 to interfere with or circumvent the security features of the
              Service or any related website, other websites, or the Internet.
              <br />
              We reserve the right to terminate your use of the Service or any
              related website for violating any of these prohibited uses.
            </p>
          </Section>

          {/* Section 15.0 Disclaimer */}
          <Section title="15.0 Disclaimer of Warranties and Limitation of Liability">
            <h3 className="font-bold text-gray-900 mt-2">
              15.0 Disclaimer of Warranties and Limitation of Liability
            </h3>
            <p>
              <strong className="text-gray-900">15.1</strong> We do not
              guarantee, represent or warrant that your use of our service will
              be uninterrupted, timely, secure or error-free.
            </p>
            <p>
              <strong className="text-gray-900">15.2</strong> We do not warrant
              that the results that may be obtained from the use of the service
              will be accurate or reliable.
            </p>
            <p>
              <strong className="text-gray-900">15.3</strong> You agree that
              from time to time we may remove the service for indefinite periods
              of time or cancel the service at any time, without notice to you.
            </p>
            <p>
              <strong className="text-gray-900">15.4</strong> You expressly
              agree that your use of, or inability to use, the service is at
              your sole risk. The service and all products and services
              delivered to you through the service are (except as expressly
              stated by us) provided ‘as is’ and ‘as available’ for your use,
              without any representation, warranties or conditions of any kind,
              either express or implied, including all implied warranties or
              conditions of merchantability, merchantable quality, fitness for a
              particular purpose, durability, title, and non-infringement.
            </p>
            <p>
              <strong className="text-gray-900">15.5</strong> In no case shall
              M3R, our directors, officers, employees, affiliates, agents,
              contractors, interns, suppliers, service providers or licensors be
              liable for any injury, loss, claim, or any direct, indirect,
              incidental, punitive, special, or consequential damages of any
              kind, including, without limitation lost profits, lost revenue,
              lost savings, loss of data, replacement costs, or any similar
              damages, whether based in contract, tort (including negligence),
              strict liability or otherwise, arising from your use of any of the
              service or any products procured using the service, or for any
              other claim related in any way to your use of the service or any
              product, including, but not limited to, any errors or omissions in
              any content, or any loss or damage of any kind incurred as a
              result of the use of the service or any content (or product)
              posted, transmitted, or otherwise made available via the service,
              even if advised of their possibility. Because some states or
              jurisdictions do not allow the exclusion or the limitation of
              liability for consequential or incidental damages, in such states
              or jurisdictions, our liability shall be limited to the minimum
              extent permitted by law.
            </p>
          </Section>

          {/* Section 16.0 - 24.0 Legal & Contact */}
          <Section title="16.0 - 24.0 Legal & Contact Information">
            <h3 className="font-bold text-gray-900 mt-4">
              16.0 Indemnification
            </h3>
            <p>
              You agree to indemnify, defend and hold harmless M3R and our
              subsidiaries, affiliates, partners, officers, directors, agents,
              contractors, licensors, service providers, subcontractors,
              suppliers, interns and employees, harmless from any claim or
              demand, including reasonable attorneys’ fees, made by any
              third-party due to or arising out of your breach of these Terms
              and Conditions or the documents they incorporate by reference, or
              your violation of any law or the rights of a third-party.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">17.0 Severability</h3>
            <p>
              In the event that any provision of these Terms and Conditions is
              determined to be unlawful, void or unenforceable, such provision
              shall nonetheless be enforceable to the fullest extent permitted
              by applicable law, and the unenforceable portion shall be deemed
              to be severed from these Terms and Conditions, such determination
              shall not affect the validity and enforceability of any other
              remaining provisions.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">18.0 Termination</h3>
            <p>
              <strong className="text-gray-900">18.1</strong> The obligations
              and liabilities of the parties incurred prior to the termination
              date shall survive the termination of this agreement for all
              purposes.
            </p>
            <p>
              <strong className="text-gray-900">18.2</strong> These Terms and
              Conditions are effective unless and until terminated by either you
              or us. You may terminate these Terms and Conditions at any time by
              notifying us that you no longer wish to use our Services, or when
              you cease using our site.
            </p>
            <p>
              <strong className="text-gray-900">18.3</strong> If in our sole
              judgment you fail, or we suspect that you have failed, to comply
              with any term or provision of these Terms and Conditions, we also
              may terminate this agreement at any time without notice and you
              will remain liable for all amounts due up to and including the
              date of termination; and/or accordingly may deny you access to our
              Services (or any part thereof).
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              19.0 Entire Agreement
            </h3>
            <p>
              <strong className="text-gray-900">19.1</strong> The failure of us
              to exercise or enforce any right or provision of these Terms and
              Conditions shall not constitute a waiver of such right or
              provision.
            </p>
            <p>
              <strong className="text-gray-900">19.2</strong> These Terms and
              Conditions and any policies or operating rules posted by us on
              this site or in respect to The Service constitutes the entire
              agreement and understanding between you and us and govern your use
              of the Service, superseding any prior or contemporaneous
              agreements, communications and proposals, whether oral or written,
              between you and us (including, but not limited to, any prior
              versions of the Terms and Conditions).
            </p>
            <p>
              <strong className="text-gray-900">19.3</strong> Any ambiguities in
              the interpretation of these Terms and Conditions shall not be
              construed against the drafting party.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              20.0 Official Version – English Language
            </h3>
            <p>
              The English version of this entire agreement is the official
              version. In event of any dispute, the English version shall be
              reference. All other languages versions translated are solely for
              the purpose of facilitating better understanding of this
              agreement.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">21.0 Governing Law</h3>
            <p>
              These Terms and Conditions and any separate agreements whereby we
              provide you Services shall be governed by and construed in
              accordance with Malaysian law and any disputes will be decided
              only by the Malaysian courts.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">22.0 Local Tax Law</h3>
            <p>
              Any tax arising from a member’s participation in this programme is
              the sole responsibility of the Member.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              23.0 Changes to Terms and Conditions
            </h3>
            <p>
              We reserve the absolute right, at our sole discretion, to update,
              change or replace any part of these Terms and Conditions by
              posting updates and changes to our website. It is your
              responsibility to check our website periodically for changes. Your
              continued use of or access to our website or the Service following
              the posting of any changes to these Terms and Conditions
              constitutes acceptance of those changes.
            </p>

            <h3 className="font-bold text-gray-900 mt-4">
              24.0 Contact Information
            </h3>
            <p>
              Questions about the Terms and Conditions should be sent to us at
              info@max15.my.
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
