
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Download, 
  QrCode, 
  MessageSquare, 
  ChevronRight,
  Send,
  X,
  Menu,
  Award,
  Briefcase,
  Cpu,
  Calendar,
  ShieldCheck,
  Lock,
  MessageCircle,
  Phone,
  Github,
  Twitter,
  Globe,
  Languages,
  Wifi,
  WifiOff,
  Eye,
  Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchProfileData } from './cmsService';
import { getAIAssistance } from './geminiService';
import { Language, GlobalData, Certificate, Project } from './types';
import { ErrorBoundary } from './ErrorBoundary';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

const AppContent: React.FC = () => {
  const [data, setData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('experience');
  const [showQR, setShowQR] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [systemOnline, setSystemOnline] = useState(true);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const init = async () => {
      try {
        const result = await fetchProfileData();
        setData(result);
      } catch (e) {
        setSystemOnline(false);
      } finally {
        setIsLoading(false);
      }
    };
    init();

    const updateOnline = () => setSystemOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const isRtl = lang === 'ar';
  const profile = data?.content[lang];

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    if (selectedCert || showQR || isAIChatOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedCert, showQR, isAIChatOpen, isMobileMenuOpen]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const aiResponse = await getAIAssistance(userMsg, lang);
    setIsTyping(false);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse || '' }]);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const labels = {
    en: {
      experience: 'Experience',
      skills: 'Skills',
      work: 'Work',
      certs: 'Certificates',
      contact: 'Contact',
      education: 'Education',
      insights: 'Insights',
      download: 'CV Resume',
      printPreview: 'Print Preview',
      chat: 'AI Assistant',
      openRoles: 'Available for Opportunities',
      heroSecuring: 'Securing systems,',
      heroEmpowering: 'empowering info.',
      networkWith: 'Digital Business Card',
      qrDesc: 'Scan to save my contact info instantly.',
      showQr: 'Show QR Code',
      letComm: "Get in Touch",
      contactDesc: 'Have a project or security inquiry? Reach out below.',
      emailMe: 'Email Me',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      yourName: 'Name',
      emailAddr: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sent: 'Sent Successfully!',
      assistantName: 'Security Assistant',
      activeSystem: 'System Online',
      aiGreeting: "Hello! I'm Hamid's AI assistant. Ask me about his experience or skills.",
      enterQuery: 'Type your message...',
      connectInstantly: 'Connect Instantly',
      scanDesc: "Scan to visit my digital profile.",
      copy: '© 2025 Hamid Idris Mussa. All rights reserved.',
      proExp: 'Professional Experience',
      acadCred: 'Education',
      completed: 'Completed',
      sysStatus: 'Service Status',
      online: 'Optimal',
      offline: 'Offline',
      viewCert: 'View Certificate',
      verify: 'Verify Online',
      close: 'Close',
      home: 'Home'
    },
    ar: {
      experience: 'الخبرة',
      skills: 'المهارات',
      work: 'الأعمال',
      certs: 'الشهادات',
      contact: 'اتصل بي',
      education: 'التعليم',
      insights: 'رؤى وأبحاث',
      download: 'تحميل السيرة الذاتية',
      printPreview: 'معاينة الطباعة',
      chat: 'المساعد الذكي',
      openRoles: 'متاح للفرص الوظيفية',
      heroSecuring: 'تأمين الأنظمة،',
      heroEmpowering: 'تمكين المعلومات.',
      networkWith: 'بطاقة العمل الرقمية',
      qrDesc: 'امسح الرمز لحفظ جهات الاتصال.',
      showQr: 'إظهار رمز QR',
      letComm: 'تواصل معي',
      contactDesc: 'هل لديك مشروع أو استفسار أمني؟ تواصل معي أدناه.',
      emailMe: 'راسلني',
      whatsapp: 'واتساب',
      telegram: 'تيليجرام',
      yourName: 'الاسم',
      emailAddr: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      send: 'إرسال الرسالة',
      sent: 'تم الإرسال بنجاح!',
      assistantName: 'مساعد أمن المعلومات',
      activeSystem: 'النظام متصل',
      aiGreeting: 'مرحباً! أنا المساعد الذكي لحامد. اسألني عن خبراته أو مهاراته.',
      enterQuery: 'اكتب رسالتك هنا...',
      connectInstantly: 'اتصل فوراً',
      scanDesc: 'امسح هذا الرمز لزيارة ملفي الشخصي.',
      copy: '© 2025 حامد إدريس موسى. جميع الحقوق محفوظة.',
      proExp: 'الخبرة المهنية',
      acadCred: 'التعليم',
      completed: 'اكتمل في',
      sysStatus: 'حالة الخدمة',
      online: 'مثالية',
      offline: 'غير متصل',
      viewCert: 'عرض الشهادة',
      verify: 'تحقق عبر الإنترنت',
      close: 'إغلاق',
      home: 'الرئيسية'
    }
  }[lang];

  const navLinks = [
    { name: labels.home, id: 'home', icon: Globe },
    { name: labels.skills, id: 'skills', icon: Cpu },
    { name: labels.experience, id: 'experience', icon: Briefcase },
    { name: labels.work, id: 'work', icon: ExternalLink },
    { name: labels.certs, id: 'certs', icon: Award },
    { name: labels.contact, id: 'contact', icon: Mail }
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (id === 'experience') setActiveTab('experience');
    if (id === 'certs') setActiveTab('education');

    const targetId = (id === 'experience' || id === 'certs') ? 'info-tabs' : id;
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading || !data || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 p-12 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 animate-pulse">Initializing Secure Environment...</p>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { icon: Linkedin, link: data.socials.linkedin, color: 'hover:text-blue-500' },
    { icon: Github, link: data.socials.github, color: 'hover:text-slate-200' },
    { icon: Twitter, link: data.socials.twitter, color: 'hover:text-sky-400' },
    { icon: MessageCircle, link: data.socials.telegram, color: 'hover:text-sky-400' },
    { icon: Phone, link: data.socials.whatsapp, color: 'hover:text-emerald-400' }
  ];

  return (
    <div className={`min-h-screen selection:bg-cyan-500/30 bg-slate-950 text-slate-200 ${isRtl ? 'font-[Tajawal,sans-serif]' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">HI</span>
            <span className="hidden sm:inline-block">HAMID IDRIS</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-5">
              {navLinks.map(link => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)} 
                  className="text-xs lg:text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="text-xs font-bold text-cyan-400 uppercase mr-2">
                {lang === 'en' ? 'عربي' : 'EN'}
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold transition-all">
                <Printer size={14} /> {labels.printPreview}
              </button>
              <button onClick={handleContactSubmit} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-cyan-500/20">
                {labels.download}
              </button>
            </div>
          </div>

          <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col p-8 md:hidden animate-in fade-in duration-300">
          <div className="flex justify-end mb-12">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={32} /></button>
          </div>
          <div className="flex flex-col gap-8 text-center overflow-y-auto pb-12">
            {navLinks.map(link => (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                onClick={(e) => handleNavClick(e, link.id)} 
                className="text-2xl font-bold text-slate-200 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-4 mt-8 px-4">
              <button 
                onClick={handlePrint} 
                className="w-full bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Printer size={20} /> {labels.printPreview}
              </button>
              <button 
                onClick={handleContactSubmit} 
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-bold shadow-xl"
              >
                {labels.download}
              </button>
              <button 
                onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setIsMobileMenuOpen(false); }} 
                className="text-xl font-bold text-cyan-400 uppercase mt-4"
              >
                {lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section id="home" className={`mb-32 flex flex-col md:flex-row gap-12 items-center scroll-mt-28 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex-1 space-y-8 text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> {labels.openRoles}
            </div>
            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              {labels.heroSecuring} <span className="gradient-text">{labels.heroEmpowering}</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto md:mx-0">{profile.bio}</p>
            <div className={`flex flex-wrap justify-center gap-4 ${isRtl ? 'md:justify-start' : 'md:justify-start'} no-print`}>
              <button onClick={() => setIsAIChatOpen(true)} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                <MessageSquare size={20} /> {labels.chat}
              </button>
              <div className="flex items-center gap-2">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.link} target="_blank" className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all text-slate-400">
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-[400px] aspect-[3/4] rounded-[40px] overflow-hidden relative border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop" 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" 
              alt={profile.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl border-white/10">
              <p className="text-xl font-bold">{profile.name}</p>
              <p className="text-sm text-cyan-400 font-medium">{profile.title}</p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-32 scroll-mt-28">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.skills.map(cat => (
                <div key={cat.category} className={`p-8 rounded-3xl bg-white/5 border border-white/10 group ${isRtl ? 'text-right' : 'text-left'}`}>
                   <h3 className="text-cyan-400 font-bold mb-4 uppercase text-[10px] tracking-[0.3em]">{cat.category}</h3>
                   <div className="space-y-2.5">
                      {cat.items.map(skill => (
                        <div key={skill} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                           <div className="w-1 h-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                           {skill}
                        </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Info Tabs (Experience/Certs) */}
        <section id="info-tabs" className="grid lg:grid-cols-3 gap-12 mb-32 scroll-mt-28">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex gap-8 border-b border-white/5 no-print">
              <button 
                onClick={() => setActiveTab('experience')} 
                className={`pb-4 text-lg font-bold relative transition-colors ${activeTab === 'experience' ? 'text-white' : 'text-slate-500'}`}
              >
                {labels.experience}
                {activeTab === 'experience' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('education')} 
                className={`pb-4 text-lg font-bold relative transition-colors ${activeTab === 'education' ? 'text-white' : 'text-slate-500'}`}
              >
                {labels.certs}
                {activeTab === 'education' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
            </div>
            
            {activeTab === 'experience' ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {profile.experience.map(exp => (
                  <div key={exp.id} className={`group relative ${isRtl ? 'pr-8 border-r' : 'pl-8 border-l'} border-white/10 hover:border-cyan-500 transition-all`}>
                    <div className={`absolute ${isRtl ? '-right-1' : '-left-1'} top-2 w-2 h-2 rounded-full bg-slate-800 group-hover:bg-cyan-500 transition-colors`} />
                    <div className="space-y-2">
                      <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">{exp.period}</p>
                      <h3 className="text-2xl font-bold">{exp.role}</h3>
                      <p className="text-slate-400 font-medium">{exp.company}</p>
                      <ul className="mt-4 space-y-3 text-slate-400 text-sm leading-relaxed">
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight size={16} className={`mt-0.5 flex-shrink-0 text-cyan-500/50 ${isRtl ? 'rotate-180' : ''}`} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {profile.certificates.map(cert => (
                  <div 
                    key={cert.id} 
                    onClick={() => setSelectedCert(cert)}
                    className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-all cursor-pointer"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                      <img src={cert.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={cert.name} />
                      <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye className="text-white" /></div>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{cert.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8 no-print">
            <div id="work" className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-cyan-600 text-white scroll-mt-28">
              <h3 className="text-2xl font-bold mb-4">{labels.networkWith}</h3>
              <p className="text-white/80 text-sm mb-6">{labels.qrDesc}</p>
              <button onClick={() => setShowQR(true)} className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <QrCode size={20} /> {labels.showQr}
              </button>
            </div>
            
            <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-6">{labels.insights}</h3>
              <div className="space-y-6">
                {profile.blog.map(post => (
                  <div key={post.id} className="group cursor-pointer">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase mb-1">{post.date}</p>
                    <h4 className="font-bold group-hover:text-cyan-400 transition-colors">{post.title}</h4>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-32 scroll-mt-28 no-print">
          <div className="glass rounded-[48px] p-8 md:p-16 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10" />
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold">{labels.letComm}</h2>
                <p className="text-slate-400 max-w-md">{labels.contactDesc}</p>
                <div className="space-y-4">
                  <a href={`mailto:${data.email}`} className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all"><Mail size={20} /></div>
                    <div><p className="text-xs text-slate-500 uppercase font-bold">{labels.emailMe}</p><p className="font-semibold">{data.email}</p></div>
                  </a>
                  {data.socials.whatsapp && (
                    <a href={data.socials.whatsapp} className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Phone size={20} /></div>
                      <div><p className="text-xs text-slate-500 uppercase font-bold">{labels.whatsapp}</p><p className="font-semibold">Chat Directly</p></div>
                    </a>
                  )}
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required type="text" placeholder={labels.yourName} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all" />
                  <input required type="email" placeholder={labels.emailAddr} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all" />
                </div>
                <input required type="text" placeholder={labels.subject} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all" />
                <textarea required rows={4} placeholder={labels.message} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500 transition-all resize-none"></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : <><Send size={20} /> {labels.send}</>}
                </button>
                {submitStatus === 'success' && <p className="text-emerald-400 text-sm font-bold text-center mt-4 animate-bounce">{labels.sent}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-sm">{labels.copy}</div>
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{labels.sysStatus}</span>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${systemOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {systemOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {systemOnline ? labels.online : labels.offline}
            </div>
          </div>
          <div className="flex gap-6">
            {socialLinks.map((s, i) => <a key={i} href={s.link} target="_blank" className={`text-slate-400 transition-colors ${s.color}`}><s.icon size={20} /></a>)}
          </div>
        </div>
      </footer>

      {/* AI Assistant Drawer */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end no-print">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAIChatOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className={`p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h3 className="font-bold">{labels.assistantName}</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {labels.activeSystem}</p>
                </div>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className={`bg-white/5 p-4 rounded-2xl text-sm leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>{labels.aiGreeting}</div>
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${chat.role === 'user' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white/5 text-slate-300'}`}>{chat.text}</div>
                </div>
              ))}
              {isTyping && <div className="flex gap-1.5 p-4 bg-white/5 rounded-2xl w-16"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" /></div>}
            </div>
            <div className="p-6 border-t border-white/5">
              <div className="relative">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={labels.enterQuery} className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 focus:outline-none focus:border-cyan-500 transition-all text-sm ${isRtl ? 'text-right pr-6 pl-14' : 'text-left pl-6 pr-14'}`} />
                <button onClick={handleSendMessage} className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-2.5 p-2 bg-cyan-600 rounded-xl text-white hover:bg-cyan-500 transition-colors`}><Send size={18} className={isRtl ? 'rotate-180' : ''} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 no-print">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowQR(false)} />
          <div className="relative bg-white p-12 rounded-[40px] text-center max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowQR(false)} className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} p-2 text-slate-400 hover:text-slate-600`}><X size={24} /></button>
            <div className="space-y-6">
              <div className="inline-block p-4 bg-white rounded-3xl shadow-xl border border-slate-100"><QRCodeSVG value={window.location.href} size={200} level="H" /></div>
              <div><h3 className="text-slate-900 text-2xl font-bold mb-2">{labels.connectInstantly}</h3><p className="text-slate-500 text-sm leading-relaxed">{labels.scanDesc}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 md:p-8 no-print">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedCert(null)} />
          <div className={`relative max-w-4xl w-full glass rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300 ${isRtl ? 'text-right' : 'text-left'}`}>
            <button onClick={() => setSelectedCert(null)} className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all`}><X size={24} /></button>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 aspect-video lg:aspect-square overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={selectedCert.imageUrl} alt={selectedCert.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs"><Award size={16} /> {labels.viewCert}</div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{selectedCert.name}</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500"><Globe size={20} /></div>
                    <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lang === 'en' ? 'Issuer' : 'الجهة المصدرة'}</p><p className="font-semibold">{selectedCert.issuer}</p></div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500"><Calendar size={20} /></div>
                    <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lang === 'en' ? 'Date' : 'التاريخ'}</p><p className="font-semibold">{selectedCert.date}</p></div>
                  </div>
                </div>
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  {selectedCert.link && (
                    <a href={selectedCert.link} target="_blank" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"><ExternalLink size={18} /> {labels.verify}</a>
                  )}
                  <button onClick={() => setSelectedCert(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all border border-white/10">{labels.close}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;
