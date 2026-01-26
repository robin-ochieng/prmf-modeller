'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, Users, AlertTriangle, Shield, Gavel, Globe, RefreshCw, Mail, ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function TermsOfService() {
  const lastUpdated = 'January 2026'
  const effectiveDate = 'January 1, 2026'

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using the PRMF Premium Calculator ("Service") provided by Kenbright Holdings Limited ("Kenbright", "we", "us", or "our"), you ("User", "you", or "your") agree to be bound by these Terms of Service ("Terms").',
        'If you do not agree to these Terms, you must not access or use our Service. Your continued use of the Service following any changes to these Terms constitutes your acceptance of such changes.',
        'These Terms constitute a legally binding agreement between you and Kenbright Holdings Limited, a company registered and operating under the laws of Kenya.',
        'You must be at least 18 years of age to use this Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into this agreement.'
      ]
    },
    {
      id: 'description',
      icon: FileText,
      title: 'Description of Service',
      content: [
        'The PRMF Premium Calculator is an online tool designed to provide indicative insurance premium calculations based on user-provided information including age, family size, and selected benefit options.',
        'Our Service offers:',
        '• Premium Calculations: Instant calculation of estimated insurance premiums based on your inputs',
        '• User Accounts: Secure account creation for accessing premium calculation features',
        '• Information Storage: Secure storage of your calculation history and preferences',
        '• Customer Support: Assistance with using the platform and understanding results',
        'The premium amounts provided are estimates for informational purposes only and do not constitute a binding offer of insurance coverage.'
      ]
    },
    {
      id: 'user-accounts',
      icon: Users,
      title: 'User Accounts',
      content: [
        'Account Creation: To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration.',
        'Account Security: You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access to or use of your account.',
        'Account Responsibility: You are responsible for all activities that occur under your account. Kenbright shall not be liable for any loss or damage arising from your failure to protect your account credentials.',
        'Account Termination: We reserve the right to suspend or terminate your account at our discretion if we believe you have violated these Terms or engaged in fraudulent or illegal activities.',
        'Data Accuracy: You agree to keep your account information accurate and up-to-date. Inaccurate information may affect the accuracy of premium calculations.'
      ]
    },
    {
      id: 'acceptable-use',
      icon: Shield,
      title: 'Acceptable Use Policy',
      content: [
        'You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:',
        '• Use the Service for any illegal or unauthorized purpose',
        '• Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems',
        '• Interfere with or disrupt the Service or servers connected to the Service',
        '• Transmit any viruses, malware, or other malicious code',
        '• Use automated systems (bots, scrapers) to access the Service without our express permission',
        '• Impersonate any person or entity or falsely state your affiliation with any person or entity',
        '• Collect or store personal data about other users without their consent',
        '• Use the Service in any way that could damage, disable, or impair the Service',
        'Violation of these rules may result in immediate termination of your account and potential legal action.'
      ]
    },
    {
      id: 'disclaimer',
      icon: AlertTriangle,
      title: 'Disclaimer of Warranties',
      content: [
        'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.',
        'Premium Estimates Only: The premium calculations provided by this Service are estimates based on the information you provide. Actual premiums may differ based on additional underwriting factors, verification of information, and current market conditions.',
        'No Insurance Guarantee: Using this Service does not guarantee the availability of insurance coverage or the approval of any insurance application. Coverage is subject to the terms and conditions of the specific insurance policy.',
        'Information Accuracy: While we strive to maintain accurate and up-to-date premium data, we do not warrant the accuracy, completeness, or timeliness of the information provided.',
        'Service Availability: We do not guarantee uninterrupted or error-free operation of the Service. The Service may be temporarily unavailable for maintenance or due to technical issues.',
        'Third-Party Content: Any links to third-party websites or services are provided for convenience only. We are not responsible for the content, accuracy, or practices of third-party sites.'
      ]
    },
    {
      id: 'limitation',
      icon: Scale,
      title: 'Limitation of Liability',
      content: [
        'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, KENBRIGHT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:',
        '• Any indirect, incidental, special, consequential, or punitive damages',
        '• Any loss of profits, revenue, data, or business opportunities',
        '• Any damages arising from your use or inability to use the Service',
        '• Any damages arising from reliance on information provided through the Service',
        '• Any damages arising from unauthorized access to or alteration of your data',
        'Our total liability for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid to us in the 12 months preceding the claim, or KES 10,000, whichever is less.',
        'Some jurisdictions do not allow the exclusion or limitation of certain damages. In such cases, our liability will be limited to the maximum extent permitted by law.'
      ]
    },
    {
      id: 'indemnification',
      icon: Gavel,
      title: 'Indemnification',
      content: [
        'You agree to indemnify, defend, and hold harmless Kenbright Holdings Limited and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from or related to:',
        '• Your use of the Service',
        '• Your violation of these Terms',
        '• Your violation of any rights of any third party',
        '• Any content or information you submit or transmit through the Service',
        '• Your breach of any applicable laws or regulations',
        'This indemnification obligation shall survive the termination of these Terms and your use of the Service.'
      ]
    },
    {
      id: 'intellectual-property',
      icon: Globe,
      title: 'Intellectual Property',
      content: [
        'Ownership: All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, software, and the overall design and arrangement thereof, are owned by Kenbright Holdings Limited and are protected by copyright, trademark, and other intellectual property laws.',
        'Limited License: We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes in accordance with these Terms.',
        'Restrictions: You may not copy, modify, distribute, sell, lease, or create derivative works based on any part of the Service without our prior written consent.',
        'Trademarks: "Kenbright", the Kenbright logo, and all related names, logos, and slogans are trademarks of Kenbright Holdings Limited. You may not use these marks without our prior written permission.',
        'Feedback: If you provide us with feedback, suggestions, or ideas regarding the Service, you grant us a perpetual, irrevocable, royalty-free license to use such feedback for any purpose.'
      ]
    },
    {
      id: 'modifications',
      icon: RefreshCw,
      title: 'Modifications to Terms',
      content: [
        'We reserve the right to modify these Terms at any time at our sole discretion. When we make material changes, we will:',
        '• Update the "Last Updated" date at the top of these Terms',
        '• Provide notice through the Service or via email to registered users',
        '• Allow a reasonable period for you to review the changes before they take effect',
        'Your continued use of the Service after the effective date of any modifications constitutes your acceptance of the updated Terms.',
        'If you do not agree to the modified Terms, you must stop using the Service and may request deletion of your account.'
      ]
    },
    {
      id: 'termination',
      icon: XCircle,
      title: 'Termination',
      content: [
        'By You: You may terminate your account at any time by contacting our support team or using the account deletion feature within the Service.',
        'By Us: We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.',
        'Effect of Termination: Upon termination, your right to use the Service will cease immediately. We may delete your account and associated data in accordance with our data retention policies.',
        'Survival: The following sections shall survive termination: Disclaimer of Warranties, Limitation of Liability, Indemnification, Intellectual Property, and Governing Law.'
      ]
    },
    {
      id: 'governing-law',
      icon: Scale,
      title: 'Governing Law and Dispute Resolution',
      content: [
        'Governing Law: These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions.',
        'Dispute Resolution: Any dispute arising from or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation between the parties.',
        'Mediation: If negotiation fails, the parties agree to attempt resolution through mediation administered by a mutually agreed mediator in Nairobi, Kenya.',
        'Arbitration: If mediation fails, disputes shall be finally resolved by binding arbitration in accordance with the Arbitration Act of Kenya. The arbitration shall be conducted in Nairobi, Kenya, in the English language.',
        'Jurisdiction: For any matters not subject to arbitration, you consent to the exclusive jurisdiction of the courts of Kenya.'
      ]
    },
    {
      id: 'general',
      icon: HelpCircle,
      title: 'General Provisions',
      content: [
        'Entire Agreement: These Terms, together with our Privacy Policy, constitute the entire agreement between you and Kenbright regarding the Service and supersede all prior agreements.',
        'Severability: If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.',
        'Waiver: Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.',
        'Assignment: You may not assign or transfer these Terms or your rights under them without our prior written consent. We may assign our rights and obligations under these Terms without restriction.',
        'Force Majeure: We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, or accidents.',
        'Notices: We may provide notices to you through the Service, via email, or by posting on our website. You may provide notices to us via the contact information provided below.'
      ]
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Information',
      content: [
        'If you have any questions about these Terms of Service, please contact us:',
        'Kenbright Holdings Limited',
        'ACK Garden House, 1st Ngong Avenue',
        'Nairobi, Kenya',
        'Phone: +254 709 783 000',
        'Email: info@kenbright.africa',
        'Website: www.kenbright.co.ke',
        'Office Hours: Monday - Friday, 8:00 AM - 5:00 PM EAT',
        'For legal inquiries, please email: legal@kenbright.africa'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Calculator</span>
            </Link>
            <Image
              src="/kenbrigt_logo.png"
              alt="Kenbright"
              width={120}
              height={48}
              className="object-contain h-8 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-linear-to-r from-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using our PRMF Premium Calculator service.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gray-200">
                Effective: {effectiveDate}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gray-200">
                Last Updated: {lastUpdated}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8 bg-amber-50/50 border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-amber-100">
            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Summary</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                By using the PRMF Premium Calculator, you agree to these terms. The premium calculations are estimates only and do not constitute binding insurance offers. You must be 18 or older to use this service. We reserve the right to modify these terms and terminate accounts that violate our policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Content */}
      <main className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="scroll-mt-24"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-primary-600 mb-1 block">
                          Section {index + 1}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      {section.content.map((paragraph, idx) => (
                        <p 
                          key={idx} 
                          className={`${paragraph.startsWith('•') ? 'pl-4' : ''} ${paragraph === paragraph.toUpperCase() && paragraph.length > 20 ? 'text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg' : ''}`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-primary-50 rounded-2xl border border-primary-100"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Acknowledgment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  By creating an account or using the PRMF Premium Calculator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/kenbrigt_logo.png"
                alt="Kenbright"
                width={100}
                height={40}
                className="object-contain brightness-0 invert h-8 w-auto"
              />
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-400">
                Trusted Financial Solutions
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/terms" 
                className="text-sm text-white font-medium"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Calculator
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Kenbright Holdings Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
