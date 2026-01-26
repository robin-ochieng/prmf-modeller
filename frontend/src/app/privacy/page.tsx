'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, UserCheck, Mail, ArrowLeft, FileText, Bell, Settings, Globe, Scale } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPolicy() {
  const lastUpdated = 'January 2026'

  const sections = [
    {
      id: 'introduction',
      icon: Shield,
      title: 'Introduction',
      content: [
        'Kenbright Holdings Limited ("Kenbright", "we", "us", or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our PRMF Premium Calculator and related services.',
        'We are a licensed insurance intermediary operating under the Insurance Regulatory Authority (IRA) of Kenya and comply with the Kenya Data Protection Act, 2019 and other applicable data protection regulations.',
        'By using our services, you consent to the data practices described in this policy. We encourage you to read this Privacy Policy carefully to understand our practices regarding your personal data.'
      ]
    },
    {
      id: 'information-collected',
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal Identification Information: We collect information that you voluntarily provide when using our services, including your full name, email address, phone number, and date of birth or age.',
        'Insurance-Related Information: To provide accurate premium calculations, we collect data about your desired coverage options, family composition (family size), and selected benefit options.',
        'Account Information: When you create an account, we store your login credentials (encrypted), account preferences, and communication settings.',
        'Usage Data: We automatically collect information about how you interact with our platform, including your IP address, browser type, device information, pages visited, and time spent on our services.',
        'Cookies and Tracking Technologies: We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.'
      ]
    },
    {
      id: 'use-of-information',
      icon: Settings,
      title: 'How We Use Your Information',
      content: [
        'Service Delivery: To calculate and provide personalized insurance premium quotes based on your age, family size, and selected coverage options.',
        'Account Management: To create and manage your user account, authenticate your identity, and provide customer support.',
        'Communication: To send you important updates about our services, respond to your inquiries, and provide information about insurance products that may interest you.',
        'Service Improvement: To analyze usage patterns, improve our platform functionality, and develop new features and services.',
        'Legal Compliance: To comply with applicable laws, regulations, and legal processes, including requirements from the Insurance Regulatory Authority of Kenya.',
        'Fraud Prevention: To detect, prevent, and address fraudulent or unauthorized activities on our platform.'
      ]
    },
    {
      id: 'data-sharing',
      icon: Globe,
      title: 'Information Sharing and Disclosure',
      content: [
        'Insurance Partners: We may share your information with insurance underwriters and partners to process your insurance applications and provide quotes. This is essential for delivering our core services.',
        'Service Providers: We work with trusted third-party service providers who assist us in operating our platform, including cloud hosting providers, analytics services, and customer support tools. These providers are contractually bound to protect your data.',
        'Legal Requirements: We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.',
        'Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change.',
        'With Your Consent: We may share your information for other purposes with your explicit consent.'
      ]
    },
    {
      id: 'data-security',
      icon: Lock,
      title: 'Data Security',
      content: [
        'We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:',
        '• Encryption: All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols.',
        '• Secure Storage: Personal data is stored in secure, encrypted databases with restricted access controls.',
        '• Access Controls: Only authorized personnel with a legitimate need have access to personal information.',
        '• Regular Audits: We conduct regular security assessments and vulnerability testing to identify and address potential risks.',
        '• Incident Response: We have established procedures to respond promptly to any data security incidents.',
        'While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.'
      ]
    },
    {
      id: 'data-retention',
      icon: FileText,
      title: 'Data Retention',
      content: [
        'We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including:',
        '• Active Accounts: As long as your account remains active and you continue to use our services.',
        '• Legal Requirements: For periods required by applicable laws and regulations, including insurance industry requirements in Kenya.',
        '• Dispute Resolution: To resolve disputes, enforce our agreements, and protect our legal rights.',
        'When your information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies and applicable regulations.'
      ]
    },
    {
      id: 'your-rights',
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Under the Kenya Data Protection Act, 2019 and other applicable laws, you have the following rights regarding your personal data:',
        '• Right of Access: You can request a copy of the personal information we hold about you.',
        '• Right to Rectification: You can request correction of inaccurate or incomplete personal data.',
        '• Right to Erasure: You can request deletion of your personal data, subject to legal and regulatory requirements.',
        '• Right to Restrict Processing: You can request that we limit how we use your data in certain circumstances.',
        '• Right to Data Portability: You can request to receive your data in a structured, commonly used format.',
        '• Right to Object: You can object to processing of your personal data for direct marketing purposes.',
        '• Right to Withdraw Consent: Where processing is based on consent, you can withdraw it at any time.',
        'To exercise any of these rights, please contact us using the details provided below.'
      ]
    },
    {
      id: 'cookies',
      icon: Eye,
      title: 'Cookies Policy',
      content: [
        'Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us:',
        '• Remember your preferences and settings',
        '• Understand how you use our platform',
        '• Improve our services based on your interactions',
        '• Provide personalized content and recommendations',
        'You can control cookie settings through your browser. However, disabling certain cookies may affect the functionality of our services.',
        'We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted or expired).'
      ]
    },
    {
      id: 'children',
      icon: Scale,
      title: 'Children\'s Privacy',
      content: [
        'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18 years of age.',
        'If we become aware that we have collected personal data from a child under 18 without parental consent, we will take immediate steps to delete that information.',
        'If you believe we may have collected information from a child under 18, please contact us immediately.'
      ]
    },
    {
      id: 'changes',
      icon: Bell,
      title: 'Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.',
        'When we make material changes, we will notify you by updating the "Last Updated" date at the top of this policy and, where appropriate, provide additional notice such as email notification or a prominent notice on our website.',
        'We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.'
      ]
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Us',
      content: [
        'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:',
        'Kenbright Holdings Limited',
        'ACK Garden House, 1st Ngong Avenue',
        'Nairobi, Kenya',
        'Phone: +254 709 783 000',
        'Email: info@kenbright.africa',
        'Website: www.kenbright.co.ke',
        'Office Hours: Monday - Friday, 8:00 AM - 5:00 PM EAT',
        'For data protection inquiries, you may also contact the Office of the Data Protection Commissioner of Kenya.'
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
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 to-blue-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="mt-4 text-sm text-blue-200">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
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
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx} className={paragraph.startsWith('•') ? 'pl-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
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
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-white font-medium"
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
