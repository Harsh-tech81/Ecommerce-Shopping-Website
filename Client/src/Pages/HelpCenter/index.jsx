import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import { MdExpandMore } from "react-icons/md";
import {
  IoSearchOutline,
  IoBagCheckOutline,
  IoShieldCheckmarkOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { FiPhoneCall, FiMail, FiMessageSquare } from "react-icons/fi";

const FAQ_CATEGORIES = [
  {
    id: "orders",
    title: "Orders & Tracking",
    icon: IoBagCheckOutline,
    questions: [
      {
        q: "How can I track my order status?",
        a: "You can track your order at any time using our dedicated Order Tracking page. Simply enter your Order ID to view real-time shipping milestones from order confirmation to final delivery.",
        action: { text: "Go to Order Tracking", link: "/order-tracking" },
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be canceled or delivery addresses modified within 1 hour of placement before the package is dispatched. Please contact our support team immediately or manage it from your Orders dashboard.",
      },
      {
        q: "Where do I find my Order ID?",
        a: "Your unique Order ID is sent in your order confirmation email and is also visible on your 'My Orders' account page under each placed order.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: LiaShippingFastSolid,
    questions: [
      {
        q: "How long does standard delivery take?",
        a: "Standard delivery typically takes 2-4 business days for domestic orders, depending on your pin code. Express delivery options are available at checkout.",
      },
      {
        q: "Is Free International Delivery available?",
        a: "Yes! We offer Free Shipping on all domestic orders over ₹100 and free international delivery for eligible promotional items.",
      },
      {
        q: "What should I do if my package is delayed?",
        a: "If your delivery has exceeded the estimated delivery window, check your Order Tracking page for logistics updates or reach out to our 24/7 customer care team.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: PiKeyReturn,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day hassle-free return policy on most items. Products must be unused, in their original packaging, and with all tags intact.",
      },
      {
        q: "How long does it take to receive my refund?",
        a: "Once the returned item is inspected at our warehouse (usually within 48 hours of receipt), your refund is initiated immediately and credited to your original payment method within 5-7 business days.",
      },
      {
        q: "Are return pickup charges applicable?",
        a: "Returns due to defective, damaged, or incorrect items are 100% free of charge. For other returns, complimentary doorstep pickup is available in supported locations.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Security",
    icon: IoShieldCheckmarkOutline,
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking via secure Razorpay checkout, and Cash on Delivery (COD).",
      },
      {
        q: "Is my payment information safe and secure?",
        a: "Absolutely. All transactions are encrypted with 256-bit SSL technology. We do not store your card details on our servers.",
      },
      {
        q: "What if an amount was deducted but the order failed?",
        a: "In rare cases of bank connectivity timeouts, deducted funds are automatically reversed by your bank within 24 to 48 hours. If not received, please share your transaction reference with us.",
      },
    ],
  },
];

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = FAQ_CATEGORIES.map((cat) => {
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === cat.id;
    if (!matchesCategory) return null;

    if (!searchQuery.trim()) return cat;

    const filteredQuestions = cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredQuestions.length > 0
      ? { ...cat, questions: filteredQuestions }
      : null;
  }).filter(Boolean);

  return (
    <section className="helpCenterPage bg-[#f9fafb] py-6 sm:py-10 min-h-[75vh]">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" className="mb-4">
          <Link to="/" className="text-gray-500 hover:text-[#ff5252] text-[13px] transition">
            Home
          </Link>
          <span className="text-gray-800 text-[13px] font-medium">Help Center</span>
        </Breadcrumbs>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 sm:p-12 text-center relative overflow-hidden shadow-lg mb-8 sm:mb-12">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-red-300 mb-3 backdrop-blur-sm">
              <IoHelpCircleOutline size={16} /> 24/7 Customer Support
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 tracking-tight">
              How can we assist you today?
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-6">
              Find instant answers to common questions about your orders, shipments, returns, and payments.
            </p>

            {/* Help Search Input */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Type your question or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5252] shadow-md"
              />
              <IoSearchOutline
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#ff5252] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Topics
          </button>
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#ff5252] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon size={16} />
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordions by Category */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          {filteredCategories.length > 0 ? (
            <div className="space-y-6">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 text-[#ff5252] flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-800 m-0">
                        {category.title}
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {category.questions.map((item, idx) => (
                        <Accordion
                          key={idx}
                          disableGutters
                          elevation={0}
                          sx={{
                            "&:before": { display: "none" },
                            backgroundColor: "transparent",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<MdExpandMore className="text-gray-400 text-xl" />}
                            className="hover:bg-gray-50/50"
                            sx={{ padding: { xs: "12px 16px", sm: "16px 20px" } }}
                          >
                            <span className="text-sm sm:text-base font-semibold text-gray-800 text-left">
                              {item.q}
                            </span>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{ padding: { xs: "0 16px 16px 16px", sm: "0 20px 20px 20px" } }}
                          >
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                              {item.a}
                            </p>
                            {item.action && (
                              <div className="mt-3">
                                <Link
                                  to={item.action.link}
                                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#ff5252] hover:underline"
                                >
                                  {item.action.text} &rarr;
                                </Link>
                              </div>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-600 text-sm mb-4">
                No matching answers found for "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-[#ff5252] text-sm font-semibold underline cursor-pointer"
              >
                Clear search filters
              </button>
            </div>
          )}
        </div>

        {/* Contact Support Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1">
              Still have questions?
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              Our dedicated support team is available 24/7 to resolve any issue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#ff5252] flex items-center justify-center mb-3">
                <FiPhoneCall size={22} />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">Call Us</h4>
              <p className="text-xs text-gray-500 mb-3">Available 24 hours every day</p>
              <a
                href="tel:+918001234567"
                className="text-xs sm:text-sm font-semibold text-[#ff5252] hover:underline"
              >
                +91 800 123 4567
              </a>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FiMail size={22} />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">Email Support</h4>
              <p className="text-xs text-gray-500 mb-3">Response within 2-4 hours</p>
              <a
                href="mailto:support@estore.com"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
              >
                support@estore.com
              </a>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FiMessageSquare size={22} />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1">Track An Order</h4>
              <p className="text-xs text-gray-500 mb-3">Live status & shipment updates</p>
              <Link
                to="/order-tracking"
                className="text-xs sm:text-sm font-semibold text-emerald-600 hover:underline"
              >
                Track Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HelpCenter;
