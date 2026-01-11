import React, { useState, useEffect, useRef } from 'react';
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
  Home,
  Layout,
  MapPin,
  ArrowRight,
  Info,
  AlertCircle,
  Share2,
  Filter
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { fetchProfileData } from './cmsService';
import { getAIAssistance } from './geminiService';
import { Language, GlobalData, Certificate, Project, Experience } from './types';
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

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

const AppContent: React.FC = () => {
  const [data, setData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const [expFilter, setExpFilter] = useState('All');
  const [showQR, setShowQR] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [systemOnline, setSystemOnline] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

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

  const addToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

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
      addToast(labels.sent, 'success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handleDownloadCV = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!data?.cvUrl) return;

    setIsDownloading(true);
    addToast(lang === 'en' ? 'Attempting to download CV...' : 'جاري محاولة تحميل السيرة الذاتية...', 'info');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await fetch(data.cvUrl);
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Hamid_Idris_Mussa_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast(lang === 'en' ? 'Download started' : 'بدأ التحميل', 'success');
    } catch (err) {
      console.error(err);
      addToast(
        lang === 'en' 
          ? 'CV file (resume.pdf) missing in root directory. Please upload it.' 
          : 'ملف السيرة الذاتية غير موجود في المجلد الرئيسي. يرجى رفعه.', 
        'error'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast(lang === 'en' ? 'Profile link copied!' : 'تم نسخ رابط الملف الشخصي!', 'success');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.name,
          text: `Professional Profile for ${profile?.name} - ${profile?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 80;
      canvas.height = img.height + 80;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 40, 40);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "Hamid_Idris_Mussa_Networking_QR.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        addToast(lang === 'en' ? 'Networking QR saved as PNG' : 'تم حفظ رمز التواصل بصيغة PNG', 'success');
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const labels = {
    en: {
      experience: 'Experience',
      skills: 'Skills',
      work: 'Portfolio',
      certs: 'Certificates',
      contact: 'Contact',
      download: 'Get CV',
      chat: 'AI Assistant',
      openRoles: 'Ready for Hiring',
      heroSecuring: 'Securing systems,',
      heroEmpowering: 'empowering information.',
      network: 'Digital Business Card',
      networkDesc: 'Scan this interactive portal to connect instantly with my ecosystem.',
      letComm: "Let's Connect",
      contactDesc: 'Interested in a security architect or technical specialist? Reach out below.',
      emailMe: 'Email Address',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      yourName: 'Full Name',
      emailAddr: 'Email Address',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Inquiry',
      sent: 'Inquiry Sent Successfully!',
      assistantName: 'Hamid\'s Career Bot',
      activeSystem: 'Operational',
      aiGreeting: "I'm Hamid's dedicated AI assistant. I can answer questions about his education and career background, his IT skills, or how to hire him.",
      enterQuery: 'Ask anything about my career...',
      copyLink: 'Copy URL',
      home: 'Home',
      insights: 'Latest Insights',
      langToggle: 'العربية',
      featuredWork: 'Featured Projects',
      viewProject: 'View Project',
      verifyCert: 'Verify Credential',
      downloadQR: 'Download Image',
      shareProfile: 'Share Profile',
      all: 'All',
      itSpec: 'IT Specialist',
      secArch: 'Information Security Architect'
    },
    ar: {
      experience: 'الخبرة المهنية',
      skills: 'المهارات',
      work: 'المشاريع',
      certs: 'الشهادات',
      contact: 'تواصل معي',
      download: 'تحميل السيرة الذاتية',
      chat: 'المساعد الذكي',
      openRoles: 'متاح للعمل',
      heroSecuring: 'تأمين الأنظمة،',
      heroEmpowering: 'وتمكين المعلومات.',
      network: 'بطاقة العمل الرقمية',
      networkDesc: 'امسح هذا الرمز التفاعلي للتواصل المباشر مع نظامي التقني.',
      letComm: 'لنتحدث سوياً',
      contactDesc: 'هل تبحث عن خبير في أمن المعلومات أو متخصص تقني؟ تواصل معي أدناه.',
      emailMe: 'البريد الإلكتروني',
      whatsapp: 'واتساب',
      telegram: 'تيليجرام',
      yourName: 'الاسم الكامل',
      emailAddr: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'نص الرسالة',
      send: 'إرسال الطلب',
      sent: 'تم إرسال طلبك بنجاح!',
      assistantName: 'مساعد حامد الذكي',
      activeSystem: 'نشط الآن',
      aiGreeting: 'أنا المساعد الذكي لحامد. يمكنني الإجابة على استفساراتك حول أبحاثه أو مهاراته التقنية أو كيفية توظيفه.',
      enterQuery: 'اسألني أي شيء عن مسيرة حامد...',
      copyLink: 'نسخ الرابط',
      home: 'الرئيسية',
      insights: 'رؤى تقنية',
      langToggle: 'English',
      featuredWork: 'أبرز المشاريع',
      viewProject: 'عرض المشروع',
      verifyCert: 'تحقق من الشهادة',
      downloadQR: 'تحميل كصورة',
      shareProfile: 'مشاركة الملف',
      all: 'الكل',
      itSpec: 'أخصائي تقنية معلومات',
      secArch: 'مهندس أمن معلومات'
    }
  }[lang];

  const navLinks = [
    { name: labels.home, id: 'home', icon: Home },
    { name: labels.skills, id: 'skills', icon: Cpu },
    { name: labels.work, id: 'work', icon: Layout },
    { name: labels.experience, id: 'experience', icon: Briefcase },
    { name: labels.contact, id: 'contact', icon: Mail }
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveNav(id);
    const elementId = (id === 'certs' || id === 'experience') ? 'experience' : (id === 'home' ? 'root' : id);
    if (id === 'certs') setActiveTab('education');
    if (id === 'experience') setActiveTab('experience');
    
    const element = document.getElementById(elementId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const filteredExperience = profile?.experience.filter(exp => 
    expFilter === 'All' || exp.tags.includes(expFilter)
  ) || [];

  const filterOptions = [
    { label: labels.all, value: 'All' },
    { label: labels.secArch, value: 'Information Security Architect' },
    { label: labels.itSpec, value: 'IT Specialist' }
  ];

  if (isLoading || !data || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
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
    <div className={`min-h-screen bg-slate-950 text-slate-300 selection:bg-cyan-500/30 ${isRtl ? 'font-[Cairo,sans-serif]' : 'font-sans'}`}>
      
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-6 z-[200] space-y-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right duration-300 ${
            t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            {t.type === 'success' ? <Check size={18} /> : t.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-4 md:px-8 py-4 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/10">HM</div>
            <div className="hidden sm:block">
              <h1 className="text-xs font-black tracking-wider uppercase text-white leading-none">{profile.name}</h1>
              <p className="text-[8px] text-cyan-500 uppercase font-black tracking-ultra mt-1 opacity-90">Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)} 
                  className={`text-[10px] font-black transition-all uppercase tracking-widest ${activeNav === link.id ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
                className="text-[10px] font-black text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 uppercase transition-all flex items-center gap-2"
              >
                <Globe size={14} className="text-cyan-500" />
                {labels.langToggle}
              </button>
              <button 
                onClick={handleDownloadCV} 
                disabled={isDownloading}
                className={`bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest disabled:opacity-50`}
              >
                {isDownloading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={14} />} 
                <span className="hidden sm:inline">{labels.download}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 glass rounded-[2.5rem] border border-white/10 shadow-2xl p-2 no-print">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
              >
                <link.icon size={20} className={isActive ? 'scale-110 mb-1' : 'scale-100 mb-1'} />
                <span className="text-[8px] font-black uppercase tracking-widest">{link.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="pt-28 pb-10 px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section id="home" className={`mb-24 lg:mb-40 flex flex-col md:flex-row gap-12 lg:gap-20 items-center ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex-1 space-y-6 lg:space-y-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-ultra no-print">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> {labels.openRoles}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              {labels.heroSecuring} <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{labels.heroEmpowering}</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl font-medium opacity-90">{profile.bio}</p>
            <div className={`flex flex-wrap gap-4 no-print ${isRtl ? 'justify-end' : 'justify-start'}`}>
              <button onClick={() => setIsAIChatOpen(true)} className="bg-white text-slate-950 px-6 py-3.5 rounded-xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl hover:bg-cyan-50 text-sm">
                <MessageSquare size={18} /> {labels.chat}
              </button>
              <div className="flex items-center gap-2">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.link} target="_blank" className={`p-3.5 rounded-xl bg-white/5 border border-white/10 ${s.color} transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-1`} title={s.brand}>
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full max-w-[420px] aspect-[4/5] rounded-[48px] overflow-hidden relative border border-white/10 shadow-2xl group">
            <img 
              src={profile.avatarUrl} 
              className="object-cover w-full h-full group-hover:scale-105 transition-all duration-1000 grayscale-[0.2] hover:grayscale-0" 
              alt={profile.name}
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl border-white/10 shadow-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black text-white tracking-tight leading-none">{profile.name}</p>
                  <p className="text-[9px] text-cyan-500 font-black uppercase tracking-ultra mt-2">{profile.title}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <MapPin size={14} className="text-cyan-500" /> {profile.location}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-24 lg:mb-40 scroll-mt-28">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {profile.skills.map(cat => (
                <div key={cat.category} className="p-8 rounded-[32px] bg-white/5 border border-white/10 group hover:border-cyan-500/40 transition-all hover:bg-slate-900/50">
                   <h3 className="text-cyan-500 font-black mb-8 uppercase text-[9px] tracking-ultra">{cat.category}</h3>
                   <div className="space-y-4">
                      {cat.items.map(skill => (
                        <div key={skill} className="flex items-center gap-3 text-slate-300 text-sm font-bold group/skill">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover/skill:bg-cyan-500 transition-all" />
                           {skill}
                        </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Work / Projects */}
        <section id="work" className="mb-24 lg:mb-40 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">{labels.featuredWork}</h2>
              <div className="h-1.5 w-24 bg-cyan-600 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.projects.map(project => (
              <div key={project.id} className="group relative flex flex-col bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden hover:border-cyan-500/30 transition-all">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={project.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={project.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-cyan-500/20 backdrop-blur-md text-cyan-400 text-[8px] font-black uppercase tracking-wider rounded-full border border-cyan-500/30">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed flex-1 opacity-80">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" className="mt-6 inline-flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.15em] hover:text-cyan-400 transition-colors">
                      {labels.viewProject} <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <section id="experience" className="grid lg:grid-cols-3 gap-12 lg:gap-20 mb-24 lg:mb-40 scroll-mt-28">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex gap-8 border-b border-white/5 no-print">
              <button onClick={() => setActiveTab('experience')} className={`pb-5 text-base md:text-lg font-black relative transition-all uppercase tracking-wider ${activeTab === 'experience' ? 'text-white' : 'text-slate-500 hover:text-slate-400'}`}>
                {labels.experience}
                {activeTab === 'experience' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
              <button onClick={() => setActiveTab('education')} className={`pb-5 text-base md:text-lg font-black relative transition-all uppercase tracking-wider ${activeTab === 'education' ? 'text-white' : 'text-slate-500 hover:text-slate-400'}`}>
                {labels.certs}
                {activeTab === 'education' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full" />}
              </button>
            </div>
            
            {activeTab === 'experience' ? (
              <div className="space-y-8">
                {/* Experience Filters */}
                <div className="flex flex-wrap gap-2 no-print">
                  {filterOptions.map(opt => (
                    <button 
                      key={opt.value} 
                      onClick={() => setExpFilter(opt.value)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                        expFilter === opt.value 
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10' 
                        : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-12 transition-all duration-500">
                  {filteredExperience.length > 0 ? (
                    filteredExperience.map(exp => (
                      <div key={exp.id} className={`group relative ${isRtl ? 'pr-10 border-r' : 'pl-10 border-l'} border-white/10 hover:border-cyan-500/40 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <div className={`absolute ${isRtl ? '-right-[5px]' : '-left-[5px]'} top-2 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-all shadow-[0_0_12px_rgba(6,182,212,0.5)]`} />
                        <div className="space-y-3">
                          <p className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.25em]">{exp.period}</p>
                          <h3 className="text-2xl font-black text-white tracking-tight">{exp.role}</h3>
                          <p className="text-base text-slate-400 font-bold opacity-75">{exp.company}</p>
                          
                          {/* Item Tags */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {exp.tags.map(tag => (
                              <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-cyan-500/60 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                                {tag === 'Information Security Architect' ? labels.secArch : labels.itSpec}
                              </span>
                            ))}
                          </div>

                          <ul className="mt-6 space-y-4 text-slate-400 text-sm leading-relaxed font-semibold">
                            {exp.description.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <ChevronRight size={16} className={`mt-0.5 text-cyan-500/40 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-12 text-slate-500 italic text-sm">
                      <Filter size={32} className="mb-4 opacity-20" />
                      No items matching this filter in his records.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.certificates.map(cert => (
                  <div key={cert.id} onClick={() => setSelectedCert(cert)} className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-cyan-500/40 transition-all cursor-pointer overflow-hidden hover:bg-slate-900/50">
                    <div className="aspect-video rounded-[28px] overflow-hidden mb-6 relative border border-white/5 shadow-inner">
                      <img src={cert.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={cert.name} />
                      <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]"><Eye className="text-white" size={28} /></div>
                    </div>
                    <h4 className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors tracking-tight leading-snug">{cert.name}</h4>
                    <p className="text-slate-500 text-[9px] mt-3 font-black uppercase tracking-ultra">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-8 no-print">
            {/* Reimagined Scannable Digital Business Card Card */}
            <div 
              onClick={() => setShowQR(true)}
              className="p-8 rounded-[48px] bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white shadow-2xl relative overflow-hidden group min-h-[420px] flex flex-col justify-between cursor-pointer border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-cyan-500/10 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] -ml-24 -mb-24" />
              
              <div className="relative z-10 space-y-2">
                <span className="text-cyan-500 font-black text-[9px] uppercase tracking-ultra opacity-80">{labels.network}</span>
                <h3 className="text-3xl font-black tracking-tighter leading-none">{profile.name.split(' ')[0]}'s Portal</h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-[200px] mt-2 opacity-90">{labels.networkDesc}</p>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center py-4">
                <div className="w-full aspect-square max-w-[200px] bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5" />
                  <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-slate-950 shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(6,182,212,0.2)] transition-all duration-500">
                    <QrCode size={48} className="animate-pulse" />
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-3 text-cyan-400 font-black text-[10px] uppercase tracking-ultra opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                   Scannable Business Card
                </div>
              </div>
            </div>
            
            <div className="p-10 rounded-[48px] bg-white/5 border border-white/10">
              <h3 className="text-[10px] font-black mb-10 uppercase tracking-ultra text-cyan-500">{labels.insights}</h3>
              <div className="space-y-10">
                {profile.blog.map(post => (
                  <div key={post.id} className="group cursor-pointer">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">{post.date}</p>
                    <h4 className="text-lg font-black group-hover:text-cyan-400 transition-colors leading-snug tracking-tight">{post.title}</h4>
                    <p className="text-slate-400/70 text-sm mt-3 line-clamp-2 leading-relaxed font-semibold">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-24 lg:mb-40 no-print scroll-mt-28">
          <div className="glass rounded-[4rem] p-8 md:p-16 lg:p-24 border-white/10 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
              <div className="flex-1 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{labels.letComm}</h2>
                  <div className="h-2 w-24 bg-cyan-600 rounded-full" />
                </div>
                <p className="text-lg text-slate-400 font-bold opacity-80 leading-relaxed">{labels.contactDesc}</p>
                
                <div className="space-y-6">
                  <a href={`mailto:${data.email}`} className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 border border-white/5 group hover:bg-cyan-500/10 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform shadow-lg"><Mail size={24} /></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{labels.emailMe}</p><p className="text-base md:text-lg font-black text-white">{data.email}</p></div>
                  </a>
                  <div className="flex flex-wrap gap-4">
                     <a href={data.socials.whatsapp} target="_blank" className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-emerald-500/10 transition-all">
                        <WhatsAppIcon size={24} className="text-[#25d366]" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">WhatsApp</span>
                     </a>
                     <a href={data.socials.telegram} target="_blank" className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-[#24A1DE]/10 transition-all">
                        <TelegramIcon size={24} className="text-[#24A1DE]" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Telegram</span>
                     </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required type="text" placeholder={labels.yourName} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold text-sm placeholder:text-slate-600" />
                  <input required type="email" placeholder={labels.emailAddr} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold text-sm placeholder:text-slate-600" />
                </div>
                <input required type="text" placeholder={labels.subject} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all font-bold text-sm placeholder:text-slate-600" />
                <textarea required rows={5} placeholder={labels.message} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-cyan-500 transition-all resize-none font-bold text-sm placeholder:text-slate-600"></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full bg-white text-slate-950 py-6 rounded-2xl font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-98 transition-all shadow-2xl disabled:opacity-50 text-sm uppercase tracking-[0.2em]">
                  {isSubmitting ? <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : <><Send size={20} /> {labels.send}</>}
                </button>
                {submitStatus === 'success' && <p className="text-emerald-400 text-center font-black animate-pulse mt-6 tracking-widest text-[10px] uppercase">{labels.sent}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 px-6 no-print bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] order-2 md:order-1">© 2025 • {profile.name} • Architecting Security</div>
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/5 order-1 md:order-2">
            <div className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-red-400 animate-pulse'}`} />
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-ultra">{systemOnline ? 'Services Online' : 'Offline Mode'}</span>
          </div>
          <div className="flex gap-6 order-3">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.link} target="_blank" className={`text-slate-500 ${s.color} transition-all duration-300 hover:-translate-y-1.5`} title={s.brand}>
                <s.icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* AI Assistant Drawer */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end no-print">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setIsAIChatOpen(false)} />
          <div className="relative w-full max-w-xl bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-white/10">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-xl"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="font-black text-xl tracking-tight text-white">{labels.assistantName}</h3>
                  <p className="text-[9px] text-cyan-500 font-black uppercase tracking-ultra mt-1">{labels.activeSystem}</p>
                </div>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="p-3 text-slate-500 hover:text-white bg-white/5 rounded-full transition-all hover:scale-110"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
              <div className="bg-white/5 p-6 rounded-[2rem] text-slate-300 text-sm font-semibold leading-relaxed border border-white/10 shadow-inner">{labels.aiGreeting}</div>
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-bold shadow-lg ${chat.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 border border-white/10 rounded-tl-none'}`}>{chat.text}</div>
                </div>
              ))}
              {isTyping && <div className="flex gap-2 p-5 bg-white/5 rounded-full w-20 justify-center shadow-inner"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" /></div>}
            </div>
            <div className="p-8 border-t border-white/10 bg-slate-950/40 backdrop-blur-xl">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={labels.enterQuery} 
                  className="w-full bg-white/5 border border-white/15 rounded-2xl py-5 px-7 focus:outline-none focus:border-cyan-500 transition-all font-black text-white text-sm shadow-inner" 
                />
                <button 
                  onClick={handleSendMessage} 
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 p-3 bg-cyan-600 rounded-xl text-white hover:bg-cyan-500 transition-all shadow-lg active:scale-90`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern QR Networking Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 no-print">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl" onClick={() => setShowQR(false)} />
          <div className="relative bg-white rounded-[4rem] overflow-hidden max-w-md w-full shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 flex flex-col">
            <div className="h-40 bg-slate-950 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
               <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/20 blur-[60px]" />
               <button onClick={() => setShowQR(false)} className="absolute top-8 right-8 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all backdrop-blur-md z-20"><X size={20} /></button>
            </div>
            
            <div className="px-10 pb-16 -mt-20 text-center relative z-10">
              <div className="w-36 h-36 rounded-[2.5rem] border-8 border-white bg-slate-100 mx-auto mb-8 overflow-hidden shadow-2xl relative">
                 <img src={profile.avatarUrl} className="w-full h-full object-cover grayscale-[0.2]" alt={profile.name} />
              </div>
              
              <div className="mb-10">
                <h3 className="text-slate-900 text-3xl font-black tracking-tight leading-none mb-3">{profile.name}</h3>
                <p className="text-cyan-600 text-[11px] font-black uppercase tracking-[0.25em]">{profile.title}</p>
              </div>
              
              {/* High Definition QR Code Section */}
              <div className="inline-block p-10 bg-white rounded-[4rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] mb-12 group hover:scale-[1.02] transition-all duration-500">
                <QRCodeSVG ref={qrRef} value={window.location.href} size={320} level="H" fgColor="#020617" marginSize={0} />
              </div>

              {/* Utility Sharing Actions */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleDownloadQR} 
                    className="flex-1 py-5 rounded-[1.5rem] bg-slate-50 text-slate-900 border border-slate-200 font-black text-[10px] flex items-center justify-center gap-3 transition-all uppercase tracking-widest hover:bg-slate-100 active:scale-95 shadow-sm"
                  >
                    <Download size={18} className="text-cyan-600" />
                    {labels.downloadQR}
                  </button>
                  <button 
                    onClick={handleNativeShare} 
                    className="flex-1 py-5 rounded-[1.5rem] bg-cyan-600 text-white font-black text-[10px] flex items-center justify-center gap-3 transition-all uppercase tracking-widest hover:bg-cyan-500 active:scale-95 shadow-xl shadow-cyan-500/20"
                  >
                    <Share2 size={18} />
                    {labels.shareProfile}
                  </button>
                </div>
                
                <button 
                  onClick={handleCopyLink} 
                  className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] flex items-center justify-center gap-3 transition-all uppercase tracking-widest border ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-950 text-white border-transparent hover:bg-slate-800 shadow-xl shadow-slate-900/10'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Link Copied!' : labels.copyLink}
                </button>
                
                <p className="text-slate-400 text-[9px] uppercase font-black tracking-ultra leading-relaxed mt-6 opacity-60">
                   Scannable Networking Key • Profile ID: {profile.name.replace(/\s+/g, '').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Detailed Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-6 no-print">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setSelectedCert(null)} />
          <div className="relative max-w-5xl w-full glass rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 aspect-video bg-black/40 p-10 flex items-center justify-center">
                <img src={selectedCert.imageUrl} alt={selectedCert.name} className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
              </div>
              <div className="lg:w-2/5 p-12 md:p-16 flex flex-col justify-center space-y-10">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 text-cyan-500 font-black uppercase tracking-ultra text-[9px] bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
                    <Award size={16} /> Verified Achievement
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">{selectedCert.name}</h2>
                  <div className="space-y-2">
                    <p className="text-lg text-slate-300 font-bold opacity-90">{selectedCert.issuer}</p>
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                      <Calendar size={14} className="text-cyan-500" /> Completed: {selectedCert.date}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {selectedCert.link && (
                    <a href={selectedCert.link} target="_blank" className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all shadow-xl text-xs uppercase tracking-widest">
                      <ExternalLink size={18} /> {labels.verifyCert}
                    </a>
                  )}
                  <button onClick={() => setSelectedCert(null)} className="w-full bg-white/5 text-white py-5 rounded-2xl font-black border border-white/10 hover:bg-white/10 transition-all text-xs uppercase tracking-widest">Dismiss</button>
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