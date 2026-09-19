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
    <section className="helpCenterPage bg-[#f9fafb] py-8 sm:py-14 min-h-[80vh]">
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" className="mb-4">
          <Link to="/" className="text-gray-500 hover:text-[#ff5252] text-[13px] transition">
            Home
          </Link>
          <span className="text-gray-800 text-[13px] font-medium">Help Center</span>
        </Breadcrumbs>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-50 via-white to-orange-50 text-gray-900 rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden shadow-sm mb-10 sm:mb-14 border border-red-100">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#ff5252] shadow-sm mb-4 border border-red-100">
              <IoHelpCircleOutline size={16} /> 24/7 Customer Support
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 tracking-tight text-gray-900">
              How can we assist you today?
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-8">
              Find instant answers to common questions about your orders, shipments, returns, and payments.
            </p>

            {/* Help Search Input */}
            <div className="relative max-w-lg mx-auto helpSearch">
              <input
                type="text"
                placeholder="Type your question or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5252] shadow-md border border-gray-100"
              />
              <IoSearchOutline
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-3 mb-10 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer duration-200 ${
              selectedCategory === "all"
                ? "bg-[#ff5252] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-red-50 hover:text-[#ff5252] border border-gray-200"
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer duration-200 ${
                  isSelected
                    ? "bg-[#ff5252] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-red-50 hover:text-[#ff5252] border border-gray-200"
                }`}
              >
                <Icon size={16} />
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordions by Category */}
        <div className="max-w-5xl mx-auto mb-14 sm:mb-20">
          {filteredCategories.length > 0 ? (
            <div className="space-y-8">
              {filteredCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fadeInUp stagger-${(index % 4) + 1}`}
                  >
                    <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3 border-l-4 border-l-[#ff5252]">
                      <Icon size={24} className="text-[#ff5252]" />
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 m-0">
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
                            sx={{ padding: { xs: "16px 20px", sm: "20px 24px" } }}
                          >
                            <span className="text-sm sm:text-base font-semibold text-gray-800 text-left flex items-center flex-wrap">
                              {item.q}
                              {category.id === "orders" && idx === 0 && (
                                <span className="ml-2 inline-block px-2 py-0.5 bg-red-100 text-[#ff5252] text-[10px] font-bold rounded-full uppercase tracking-wider">
                                  Popular
                                </span>
                              )}
                            </span>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{ padding: { xs: "0 20px 20px 20px", sm: "0 24px 24px 24px" } }}
                          >
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed m-0">
                              {item.a}
                            </p>
                            {item.action && (
                              <div className="mt-4">
                                <Link
                                  to={item.action.link}
                                  className="inline-flex items-center text-sm font-semibold text-[#ff5252] hover:underline"
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
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm animate-fadeInUp">
              <div className="flex justify-center mb-3 text-gray-300">
                <IoSearchOutline size={48} />
              </div>
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Our dedicated support team is available 24/7 to resolve any issue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group card-hover bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:border-[#ff5252]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#ff5252] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiPhoneCall size={24} />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-2">Call Us</h4>
              <p className="text-sm text-gray-500 mb-4">Available 24 hours every day</p>
              <a
                href="tel:+918001234567"
                className="text-sm sm:text-base font-semibold text-[#ff5252] hover:underline"
              >
                +91 800 123 4567
              </a>
            </div>

            <div className="group card-hover bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:border-[#ff5252]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#ff5252] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiMail size={24} />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-2">Email Support</h4>
              <p className="text-sm text-gray-500 mb-4">Response within 2-4 hours</p>
              <a
                href="mailto:support@estore.com"
                className="text-sm sm:text-base font-semibold text-[#ff5252] hover:underline"
              >
                support@estore.com
              </a>
            </div>

            <div className="group card-hover bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col items-center hover:border-[#ff5252]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#ff5252] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiMessageSquare size={24} />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-2">Track An Order</h4>
              <p className="text-sm text-gray-500 mb-4">Live status & shipment updates</p>
              <Link
                to="/order-tracking"
                className="text-sm sm:text-base font-semibold text-[#ff5252] hover:underline"
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
