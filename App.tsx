
import React, { useState, useEffect } from 'react';
import { 
  Linkedin, 
  Mail, 
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
  Github,
  Globe,
  Eye,
  Copy,
  Check,
  Home
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchProfileData } from './cmsService';
import { getAIAssistance } from './geminiService';
import { Language, GlobalData, Certificate } from './types';
import { ErrorBoundary } from './ErrorBoundary';

// Custom Brand Icons
const XIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

const TelegramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.891 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.257.257-.527.257l.189-2.924 5.323-4.811c.231-.205-.05-.318-.36-.112l-6.58 4.143-2.831-.885c-.615-.192-.628-.615.128-.91l11.072-4.27c.513-.186.96.119.759.916z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.541 4.191 1.57 6.039L0 24l6.105-1.601a11.832 11.832 0 005.94 1.603h.005c6.634 0 12.032-5.396 12.035-12.031a11.763 11.763 0 00-3.575-8.513"/>
  </svg>
);

const AppContent: React.FC = () => {
  const [data, setData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [systemOnline, setSystemOnline] = useState(true);
  const [activeNav, setActiveNav] = useState('home');

  // Contact Form State
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
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data?.cvUrl) {
      const link = document.createElement('a');
      link.href = data.cvUrl;
      link.download = `Hamid_Idris_Mussa_CV.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labels = {
    en: {
      experience: 'Experience',
      skills: 'Skills',
      work: 'Work',
      certs: 'Certificates',
      contact: 'Contact',
      download: 'Get CV',
      chat: 'Career AI',
      openRoles: 'Actively Hiring',
      heroSecuring: 'Securing systems,',
      heroEmpowering: 'empowering information.',
      network: 'Networking',
      networkDesc: 'Scan or copy my profile link to connect.',
      letComm: "Let's Connect",
      contactDesc: 'Open for collaborations and security architectural roles.',
      emailMe: 'Email Address',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      yourName: 'Your Name',
      emailAddr: 'Your Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sent: 'Message Sent Successfully!',
      assistantName: 'Security Advisor AI',
      activeSystem: 'Operational',
      aiGreeting: "I'm Hamid's AI representative. Ask me about his M.Sc. research, technical stack, or contact him.",
      enterQuery: 'Type your message...',
      copyLink: 'Copy Profile URL',
      home: 'Home',
      insights: 'Insights & Research',
      langToggle: 'العربية'
    },
    ar: {
      experience: 'الخبرة',
      skills: 'المهارات',
      work: 'الأعمال',
      certs: 'الشهادات',
      contact: 'اتصل بنا',
      download: 'تحميل CV',
      chat: 'المساعد الذكي',
      openRoles: 'متاح للتوظيف',
      heroSecuring: 'تأمين الأنظمة،',
      heroEmpowering: 'وتمكين المعلومات.',
      network: 'بطاقة العمل',
      networkDesc: 'امسح الرمز أو انسخ رابط الملف الشخصي للتواصل.',
      letComm: 'تواصل معي',
      contactDesc: 'متاح للتعاون والأدوار المعمارية الأمنية.',
      emailMe: 'البريد الإلكتروني',
      whatsapp: 'واتساب',
      telegram: 'تيليجرام',
      yourName: 'الاسم الكامل',
      emailAddr: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'نص الرسالة',
      send: 'إرسال الرسالة',
      sent: 'تم الإرسال بنجاح!',
      assistantName: 'مساعد الأمن الذكي',
      activeSystem: 'نشط الآن',
      aiGreeting: 'أنا الممثل الذكي لحامد. اسألني عن أبحاث الماجستير الخاصة به أو مهاراته التقنية.',
      enterQuery: 'اكتب رسالتك هنا...',
      copyLink: 'نسخ رابط الملف',
      home: 'الرئيسية',
      insights: 'الأبحاث والرؤى',
      langToggle: 'English'
    }
  }[lang];

  const navLinks = [
    { name: labels.home, id: 'home', icon: Home },
    { name: labels.skills, id: 'skills', icon: Cpu },
    { name: labels.experience, id: 'experience', icon: Briefcase },
    { name: labels.certs, id: 'certs', icon: Award },
    { name: labels.contact, id: 'contact', icon: Mail }
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveNav(id);
    if (id === 'certs') {
      setActiveTab('education');
      const element = document.getElementById('experience');
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    } else if (id === 'experience') {
      setActiveTab('experience');
      const element = document.getElementById('experience');
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    } else {
      const element = document.getElementById(id === 'home' ? 'root' : id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }
  };

  if (isLoading || !data || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 p-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const socialLinks = [
    { icon: Linkedin, link: data.socials.linkedin, color: 'hover:text-[#0077b5]', brand: 'LinkedIn' },
    { icon: Github, link: data.socials.github, color: 'hover:text-[#fafafa]', brand: 'GitHub' },
    { icon: XIcon, link: data.socials.twitter, color: 'hover:text-[#ffffff]', brand: 'X' },
    { icon: TelegramIcon, link: data.socials.telegram, color: 'hover:text-[#24A1DE]', brand: 'Telegram' },
    { icon: WhatsAppIcon, link: data.socials.whatsapp, color: 'hover:text-[#25D366]', brand: 'WhatsApp' }
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 ${isRtl ? 'font-[Cairo,sans-serif]' : 'font-sans'}`}>
      {/* Top Navigation - Desktop only or Minimal Mobile */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">HM</div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none uppercase text-white">{profile.name}</h1>
              <p className="text-[9px] text-cyan-400 uppercase font-black tracking-widest mt-1 opacity-80">Security Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)} 
                  className={`text-[11px] font-black transition-all uppercase tracking-widest ${activeNav === link.id ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:block h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2 lg:gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
                className="text-[11px] font-black text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 uppercase transition-all flex items-center gap-2"
              >
                <Globe size={14} className="text-cyan-400" />
                {labels.langToggle}
              </button>
              <button 
                onClick={() => setShowQR(true)} 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-500/10 rounded-xl text-slate-300 hover:text-cyan-400 transition-all border border-white/10 hover:border-cyan-500/30"
              >
                <QrCode size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{labels.network.split(' ')[0]}</span>
              </button>
              <button 
                onClick={handleDownloadCV} 
                className="bg-cyan-600 hover:bg-cyan-50 text-white hover:text-slate-950 px-5 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30 uppercase tracking-widest"
              >
                <Download size={14} /> <span className="hidden xs:inline">{labels.download}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Bottom Navigation for Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50 glass rounded-[32px] border border-white/10 shadow-2xl p-2 no-print">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
                <link.icon size={22} className={isActive ? 'scale-110' : 'scale-100'} />
                <span className="text-[9px] font-black uppercase tracking-widest mt-1">{link.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section id="home" className={`mb-32 flex flex-col md:flex-row gap-12 items-center ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex-1 space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] no-print">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> {labels.openRoles}
            </div>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              {labels.heroSecuring} <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{labels.heroEmpowering}</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl font-medium opacity-90">{profile.bio}</p>
            <div className={`flex flex-wrap gap-4 no-print ${isRtl ? 'justify-end' : 'justify-start'}`}>
              <button onClick={() => setIsAIChatOpen(true)} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl hover:bg-cyan-50">
                <MessageSquare size={20} /> {labels.chat}
              </button>
              <div className="flex items-center gap-3">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.link} target="_blank" className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${s.color} transition-all duration-300 hover:bg-white/[0.08] hover:scale-110`} title={s.brand}>
                    <s.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-[420px] aspect-[4/5] rounded-[48px] overflow-hidden relative border border-white/10 shadow-2xl group">
            <img 
              src={profile.avatarUrl} 
              className="object-cover w-full h-full group-hover:scale-105 transition-all duration-1000 grayscale-[0.2] hover:grayscale-0" 
              alt={profile.name}
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl border-white/10 shadow-2xl">
              <p className="text-2xl font-black text-white tracking-tight leading-none">{profile.name}</p>
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mt-2">{profile.title}</p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-32 scroll-mt-28">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.skills.map(cat => (
                <div key={cat.category} className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-cyan-500/50 transition-all hover:bg-slate-900/50">
                   <h3 className="text-cyan-400 font-black mb-8 uppercase text-[10px] tracking-[0.2em]">{cat.category}</h3>
                   <div className="space-y-4">
                      {cat.items.map(skill => (
                        <div key={skill} className="flex items-center gap-3 text-slate-200 text-sm font-bold">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 group-hover:scale-150 transition-all" />
                           {skill}
                        </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Experience & Education */}
        <section id="experience" className="grid lg:grid-cols-3 gap-16 mb-32 scroll-mt-28">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex gap-12 border-b border-white/5 no-print">
              <button onClick={() => setActiveTab('experience')} className={`pb-6 text-xl font-black relative transition-all uppercase tracking-tight ${activeTab === 'experience' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {labels.experience}
                {activeTab === 'experience' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
              <button onClick={() => setActiveTab('education')} className={`pb-6 text-xl font-black relative transition-all uppercase tracking-tight ${activeTab === 'education' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {labels.certs}
                {activeTab === 'education' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
            </div>
            
            {activeTab === 'experience' ? (
              <div className="space-y-12">
                {profile.experience.map(exp => (
                  <div key={exp.id} className={`group relative ${isRtl ? 'pr-10 border-r' : 'pl-10 border-l'} border-white/10 hover:border-cyan-500/50 transition-all`}>
                    <div className={`absolute ${isRtl ? '-right-1.5' : '-left-1.5'} top-2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-900 group-hover:bg-cyan-500 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)]`} />
                    <div className="space-y-3">
                      <p className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">{exp.period}</p>
                      <h3 className="text-3xl font-black text-white tracking-tight">{exp.role}</h3>
                      <p className="text-lg text-slate-400 font-bold opacity-80">{exp.company}</p>
                      <ul className="mt-6 space-y-4 text-slate-400 leading-relaxed font-semibold">
                        {exp.description.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <ChevronRight size={18} className={`mt-1 text-cyan-500/60 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.certificates.map(cert => (
                  <div key={cert.id} onClick={() => setSelectedCert(cert)} className="p-6 rounded-[40px] bg-white/5 border border-white/10 group hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden hover:bg-slate-900/50">
                    <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                      <img src={cert.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={cert.name} />
                      <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]"><Eye className="text-white" size={32} /></div>
                    </div>
                    <h4 className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors tracking-tight leading-tight">{cert.name}</h4>
                    <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-widest">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8 no-print">
            <div className="p-10 rounded-[48px] bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-3xl font-black mb-4 tracking-tighter">Instant Networking</h3>
              <p className="text-white/80 font-bold mb-8 leading-relaxed">Access my full digital contact details via my business QR.</p>
              <button onClick={() => setShowQR(true)} className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20">
                <QrCode size={22} /> {labels.network}
              </button>
            </div>
            
            <div className="p-10 rounded-[48px] bg-white/5 border border-white/10">
              <h3 className="text-sm font-black mb-8 uppercase tracking-[0.2em] text-cyan-400">{labels.insights}</h3>
              <div className="space-y-8">
                {profile.blog.map(post => (
                  <div key={post.id} className="group cursor-pointer">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">{post.date}</p>
                    <h4 className="text-lg font-black group-hover:text-cyan-400 transition-colors leading-snug tracking-tight">{post.title}</h4>
                    <p className="text-slate-400/80 text-sm mt-3 line-clamp-2 leading-relaxed font-semibold">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-32 no-print scroll-mt-28">
          <div className="glass rounded-[64px] p-10 md:p-20 border-white/10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-20">
              <div className="flex-1 space-y-12">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">{labels.letComm}</h2>
                <p className="text-xl text-slate-400 font-bold opacity-80 leading-relaxed">{labels.contactDesc}</p>
                <div className="space-y-8">
                  <a href={`mailto:${data.email}`} className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 border border-white/5"><Mail size={24} /></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{labels.emailMe}</p><p className="text-xl font-black text-white tracking-tight">{data.email}</p></div>
                  </a>
                  <a href={data.socials.whatsapp} target="_blank" className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-[#25d366] group-hover:bg-[#25d366] group-hover:text-white transition-all duration-300 border border-white/5"><WhatsAppIcon size={24} /></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{labels.whatsapp}</p><p className="text-xl font-black text-white tracking-tight">Chat on WhatsApp</p></div>
                  </a>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required type="text" placeholder={labels.yourName} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold placeholder:text-slate-600" />
                  <input required type="email" placeholder={labels.emailAddr} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold placeholder:text-slate-600" />
                </div>
                <input required type="text" placeholder={labels.subject} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold placeholder:text-slate-600" />
                <textarea required rows={5} placeholder={labels.message} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all resize-none font-bold placeholder:text-slate-600"></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50 text-lg tracking-tight">
                  {isSubmitting ? <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : <><Send size={22} /> {labels.send}</>}
                </button>
                {submitStatus === 'success' && <p className="text-emerald-400 text-center font-black animate-bounce mt-4 tracking-widest text-sm">{labels.sent}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 px-6 no-print bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">© 2025 • {profile.name} • All Rights Reserved</div>
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-400 animate-pulse'}`} />
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">{systemOnline ? 'System Fully Operational' : 'Offline Access Mode'}</span>
          </div>
          <div className="flex gap-6">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.link} target="_blank" className={`text-slate-500 ${s.color} transition-all duration-300 hover:scale-125`} title={s.brand}>
                <s.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* AI Assistant Drawer */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end no-print">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsAIChatOpen(false)} />
          <div className="relative w-full max-w-xl bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-800/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">{labels.assistantName}</h3>
                  <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mt-0.5">{labels.activeSystem}</p>
                </div>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="p-3 text-slate-400 hover:text-white bg-white/5 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="bg-white/5 p-6 rounded-[32px] text-slate-300 font-semibold leading-relaxed border border-white/5 shadow-inner">{labels.aiGreeting}</div>
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[24px] text-sm font-bold shadow-sm ${chat.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'}`}>{chat.text}</div>
                </div>
              ))}
              {isTyping && <div className="flex gap-2 p-5 bg-white/5 rounded-full w-20 justify-center"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" /></div>}
            </div>
            <div className="p-8 border-t border-white/5 bg-slate-950/30">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={labels.enterQuery} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-cyan-500 transition-all font-black text-white" 
                />
                <button 
                  onClick={handleSendMessage} 
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 p-3 bg-cyan-600 rounded-xl text-white hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-950`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Business Card Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 no-print">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setShowQR(false)} />
          <div className="relative bg-white rounded-[40px] overflow-hidden max-w-sm w-full shadow-[0_0_80px_rgba(6,182,212,0.4)] animate-in zoom-in-95 duration-500 flex flex-col">
            <div className="h-28 bg-gradient-to-r from-slate-900 to-slate-800 relative">
               <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><X size={18} /></button>
            </div>
            
            <div className="px-8 pb-10 -mt-14 text-center">
              <div className="w-28 h-28 rounded-[32px] border-[6px] border-white bg-slate-200 mx-auto mb-6 overflow-hidden shadow-2xl relative z-10 bg-white">
                 <img src={profile.avatarUrl} className="w-full h-full object-cover grayscale-[0.3]" alt={profile.name} />
              </div>
              
              <div className="mb-8">
                <h3 className="text-slate-900 text-2xl font-black tracking-tight leading-none mb-1">{profile.name}</h3>
                <p className="text-cyan-600 text-[10px] font-black uppercase tracking-[0.2em]">{profile.title}</p>
              </div>
              
              <div className="inline-block p-6 bg-white rounded-[40px] border border-slate-100 shadow-xl mb-8 group hover:scale-105 transition-transform duration-500">
                <QRCodeSVG 
                  value={window.location.href} 
                  size={160} 
                  level="H" 
                  includeMargin={false} 
                  fgColor="#0f172a"
                />
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleCopyLink} 
                  className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all uppercase tracking-widest ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Profile Link Copied' : labels.copyLink}
                </button>
                <p className="text-slate-400 text-[9px] uppercase font-black tracking-[0.1em] leading-relaxed max-w-[240px] mx-auto opacity-70">
                  {labels.networkDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Detailed Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setSelectedCert(null)} />
          <div className="relative max-w-5xl w-full glass rounded-[56px] overflow-hidden shadow-2xl animate-in zoom-in duration-500 border-white/10">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 aspect-video lg:aspect-square bg-slate-900/50 p-4">
                <img src={selectedCert.imageUrl} alt={selectedCert.name} className="w-full h-full object-contain rounded-[32px] shadow-2xl" />
              </div>
              <div className="lg:w-2/5 p-12 flex flex-col justify-center space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                    <Award size={16} /> Credential Details
                  </div>
                  <h2 className="text-4xl font-black text-white leading-tight tracking-tight">{selectedCert.name}</h2>
                  <div className="space-y-2">
                    <p className="text-lg text-slate-300 font-bold opacity-90">{selectedCert.issuer}</p>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} className="text-cyan-500" /> {selectedCert.date}
                    </p>
                  </div>
                </div>
                <div className="pt-8 flex flex-col gap-4">
                  {selectedCert.link && (
                    <a href={selectedCert.link} target="_blank" className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-center flex items-center justify-center gap-2 hover:bg-cyan-50 transition-colors shadow-xl">
                      <ExternalLink size={20} /> Verify Online
                    </a>
                  )}
                  <button onClick={() => setSelectedCert(null)} className="w-full bg-white/5 text-white py-5 rounded-2xl font-black border border-white/10 hover:bg-white/10 transition-colors">Dismiss</button>
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
