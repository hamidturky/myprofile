import { GlobalData } from './types';

export const globalData: GlobalData = {
  email: "haidturkey@outlook.com",
  cvUrl: "./resume.pdf",
  socials: {
    linkedin: "https://linkedin.com/in/hamid-turky",
    github: "https://github.com/hamidturky", 
    twitter: "https://x.com/Hamid_idturky",
    telegram: "https://t.me/hamid_turky", 
    whatsapp: "https://wa.me/97433428890" 
  },
  content: {
    en: {
      name: "Hamid Idris Mussa",
      title: "Information Security Architect | IT Systems Specialist",
      bio: "Master's graduate in Computer Systems Information Security from ITMO University. Expert in risk assessment, network security, and incident response with a proven track record in both academic and freelance technical environments.",
      location: "Al Rayyan, Qatar",
      avatarUrl: "./profile.png&w=800&auto=format&fit=crop",
      skills: [
        { category: "Security", items: ["Network Security", "Vulnerability Assessment", "Risk Analysis", "Web Security", "Incident Response"] },
        { category: "Systems & DevOps", items: ["Linux", "Windows Server", "VMware", "Virtualization", "Docker", "Git"] },
        { category: "Development", items: ["Python", "JavaScript", "HTML5", "CSS3", "WordPress", "SQL", "Database Management"] },
        { category: "Languages", items: ["Tigre (Native)", "Tigrigna (Fluent)", "Arabic (Advanced)", "English (Advanced)", "Russian (Intermediate)"] }
      ],
      experience: [
        {
          id: "exp1",
          company: "Eritrea Institute of Technology",
          role: "Graduate Assistant",
          period: "Oct 2015 - Sep 2019",
          tags: ["IT Specialist", "Information Security Architect"],
          description: [
            "Delivered academic support to 50+ students per semester, achieving a 30% increase in success rates.",
            "Instructed courses in Introduction to Computer Science (Python) and Hardware Maintenance.",
            "Managed hardware/software installations and troubleshooting for faculty and students.",
            "Handled critical administrative tasks including student documentation and academic record management."
          ]
        },
        {
          id: "exp2",
          company: "Freelance Technical Consultant",
          role: "IT Specialist & Developer",
          period: "Sep 2012 - Present",
          tags: ["IT Specialist"],
          description: [
            "Architected and deployed four professional websites using WordPress and modern web frameworks.",
            "Developed a bespoke ID-generating database system for the Chemical Engineering community.",
            "Diagnosed and resolved complex hardware/software issues for a diverse client base.",
            "Provided ongoing maintenance and optimization for distributed small-business networks."
          ]
        },
        {
          id: "exp3",
          company: "Ghindae Secondary School",
          role: "Math Teacher",
          period: "Sep 2014 - Sep 2015",
          tags: [],
          description: [
            "Taught advanced Mathematics to Grade 9 students following national curriculum standards.",
            "Integrated modern teaching methodologies to enhance student engagement and performance."
          ]
        }
      ],
      projects: [
        {
          id: "p1",
          title: "Cybersecurity Institutional Plan",
          description: "Master's Capstone: Developed a comprehensive security blueprint including risk assessment frameworks and incident response protocols for educational institutes.",
          tags: ["Risk Management", "Security Controls", "ITMO University"],
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "p2",
          title: "Tigrigna Sign Language Platform",
          description: "Bachelor's Capstone: A pioneering project focused on accessibility, developing a digital sign language translation system for the Tigrigna language.",
          tags: ["Computer Science", "Linguistics", "Accessibility"],
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "p3",
          title: "Community ID Database System",
          description: "Automated identity management system for community members, featuring secure data storage and dynamic ID generation.",
          tags: ["MySQL", "Database", "Security"],
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop"
        }
      ],
      certificates: [
        {
          id: "c1",
          name: "M.Sc. Computer Systems Information Security",
          issuer: "ITMO University, Russia",
          date: "Jun 2022",
          imageUrl: "./MSc diploma.png"
        },
        {
          id: "c2",
          name: "B.Sc. Computer Science",
          issuer: "Eritrea Institute of Technology",
          date: "Jun 2014",
          imageUrl: "./Hamid_Bachelor's Diploma.JPG"
        },
        {
          id: "c3",
          name: "Congress of Young Scientists (КМУ) Participation",
          issuer: "ITMO University",
          date: "April 2025",
          imageUrl: "./KMU Conference participation certificate.png"
        },
        {
          id: "c4",
          name: "Jury Member - II Open International Olympiad in Informatics",
          issuer: "Ministry of Education of Turkmenistan & Yagshygeldi Kakayev International Oil and Gas University",
          date: "Apr 2024",
          imageUrl: "./Mussa_Hamid_Idris_Jury_certificate.JPG"
        }
      ],
      blog: [
        {
          id: "b1",
          title: "The Blueprint for Institutional Cybersecurity",
          excerpt: "Deep dive into building resilient security frameworks for educational environments, focusing on risk assessment and proactive incident response strategies.",
          date: "Mar 2024",
          category: "Security Research"
        },
        {
          id: "b2",
          title: "Hardening Linux for Production Environments",
          excerpt: "Essential configurations and security modules like SELinux and AppArmor to protect your infrastructure.",
          date: "Feb 2024",
          category: "SysAdmin"
        }
      ]
    },
    ar: {
      name: "حامد إدريس موسى",
      title: "خبير أمن المعلومات وهندسة النظم",
      bio: "حاصل على درجة الماجستير في أمن أنظمة الكمبيوتر من جامعة ITMO. متخصص في تقييم المخاطر وأمن الشبكات والاستجابة للحوادث، مع خبرة مثبتة في البيئات الأكاديمية والعمل الحر.",
      location: "الريان، قطر",
      avatarUrl: "profile.png",
      skills: [
        { category: "الأمن", items: ["أمن الشبكات", "تقييم الضعف", "تحليل المخاطر", "أمن الويب", "الاستجابة للحوادث"] },
        { category: "الأنظمة و DevOps", items: ["لينكس", "ويندوز سيرفر", "VMware", "الافتراضية", "دوكر", "جيت"] },
        { category: "التطوير", items: ["بايثون", "جافا سكريبت", "HTML5", "CSS3", "ووردبريس", "MySQL", "إدارة قواعد البيانات"] },
        { category: "اللغات", items: ["التجري (الأم)", "التجرينية (طلاقة)", "العربية (متقدم)", "الإنجليزية (متقدم)", "الروسية (متوسط)"] }
      ],
      experience: [
        {
          id: "exp1",
          company: "معهد إريتريا للتكنولوجيا",
          role: "مساعد خريج",
          period: "أكتوبر 2015 - سبتمبر 2019",
          tags: ["IT Specialist", "Information Security Architect"],
          description: [
            "تقديم الدعم الأكاديمي لأكثر من 50 طالباً في الفصل الدراسي الواحد.",
            "تدريس دورات في مقدمة علوم الكمبيوتر (بايثون) وصيانة الأجهزة.",
            "إدارة تركيبات الأجهزة والبرامج واستكشاف الأخطاء وإصلاحها.",
            "التعامل مع المهام الإدارية الحرجة بما في ذلك توثيق الطلاب."
          ]
        },
        {
          id: "exp2",
          company: "مستشار تقني مستقل",
          role: "أخصائي تقنية معلومات ومطور",
          period: "سبتمبر 2012 - الحاضر",
          tags: ["IT Specialist"],
          description: [
            "تصميم ونشر أربعة مواقع احترافية باستخدام ووردبريس وأطر الويب الحديثة.",
            "تطوير نظام قاعدة بيانات مخصص لتوليد الهويات لمجتمع الهندسة الكيميائية.",
            "تشخيص وحل مشكلات الأجهزة والبرامج المعقدة لقاعدة عملاء متنوعة.",
            "توفير الصيانة والتحسين المستمر للشبكات الموزعة للشركات الصغيرة."
          ]
        },
        {
          id: "exp3",
          company: "مدرسة غيندا الثانوية",
          role: "مدرس رياضيات",
          period: "سبتمبر 2014 - سبتمبر 2015",
          tags: [],
          description: [
            "تدريس الرياضيات المتقدمة لطلاب الصف التاسع وفقاً للمعايير الوطنية.",
            "دمج منهجيات التدريس الحديثة لتعزيز مشاركة الطلاب وأدائهم."
          ]
        }
      ],
      projects: [
        {
          id: "p1",
          title: "خطة الأمن السيبراني المؤسسية",
          description: "مشروع الماجستير: تطوير مخطط أمني شامل يتضمن أطر تقييم المخاطر وبروتوكولات الاستجابة للحوادث.",
          tags: ["إدارة المخاطر", "ضوابط الأمن", "جامعة ITMO"],
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "p2",
          title: "منصة لغة الإشارة التجرينية",
          description: "مشروع البكالوريوس: مشروع رائد يركز على إمكانية الوصول، وتطوير نظام ترجمة رقمي للغة الإشارة التجرينية.",
          tags: ["علوم الكمبيوتر", "اللغويات", "إمكانية الوصول"],
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
        },
        {
          id: "p3",
          title: "نظام قاعدة بيانات الهوية المجتمعية",
          description: "نظام آلي لإدارة الهوية لأعضاء المجتمع، يتميز بتخزين آمن للبيانات وتوليد ديناميكي للهوية.",
          tags: ["MySQL", "قاعدة بيانات", "الأمن"],
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop"
        }
      ],
      certificates: [
        {
          id: "c1",
          name: "ماجستير في أمن معلومات أنظمة الكمبيوتر",
          issuer: "جامعة ITMO، روسيا",
          date: "يونيو 2022",
          imageUrl: "./MSc diploma.png"
        },
        {
          id: "c2",
          name: "بكالوريوس في علوم الكمبيوتر",
          issuer: "معهد إريتريا للتكنولوجيا",
          date: "يونيو 2014",
          imageUrl: "./Hamid_Bachelor's Diploma.JPG"
        },
        {
          id: "c3",
          name: "شهادة مشاركة في مؤتمر العلماء الشباب (КМУ)",
          issuer: "جامعة ITMO",
          date: "أبريل 2025",
          imageUrl: "./KMU Conference participation certificate.png"
        },
        {
          id: "c4",
          name: "عضو لجنة التحكيم - الأولمبياد الدولي المفتوح الثاني للمعلوماتية",
          issuer: "وزارة التعليم في تركمانستان وجامعة ياغشيغلدي كاكاييف الدولية للنفط والغاز",
          date: "أبريل 2024",
          imageUrl: "./Mussa_Hamid_Idris_Jury_certificate.JPG"
        }
      ],
      blog: [
        {
          id: "b1",
          title: "مخطط الأمن السيبراني المؤسسي",
          excerpt: "نظرة متعمقة على بناء أطر أمنية مرنة للبيئات التعليمية.",
          date: "مارس 2024",
          category: "أبحاث الأمن"
        },
        {
          id: "b2",
          title: "تحصين لينكس لبيئات الإنتاج",
          excerpt: "التكوينات الأساسية ووحدات الأمان مثل SELinux و AppArmor لحماية بنيتك التحتية.",
          date: "فبراير 2024",
          category: "مدير نظام"
        }
      ]
    }
  }
};
