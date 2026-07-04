'use client';

/* eslint-disable @next/next/no-img-element -- This page renders user-managed remote and data URL images in editor previews and modal content. */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  AppWindow, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Map,
  Store,
  Users,
  Globe,
  ShieldCheck,
  FileText,
  PlaySquare,
  Newspaper,
  Phone,
  LogIn,
  Mail,
  Lock,
  Handshake,
  Presentation,
  Youtube,
  FileDown,
  User,
  ChevronRight,
  Settings,
  Save,
  Edit3,
  Trash2,
  Plus,
  Image as ImageIcon,
  Box,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Briefcase,
  Calendar
} from 'lucide-react';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import FiriForms from './components/FiriForms';

export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTutorialTab, setActiveTutorialTab] = useState('1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('home');
  
  const defaultSiteContent = useMemo(() => ({
    logo: '/Foto.jpeg',
    heroBgImage: '',
    heroImage: 'https://picsum.photos/seed/village-tech/800/600',
    heroTitleStart: 'Wujudkan',
    heroTitleHighlight: 'Desa Digital',
    heroTitleEnd: 'yang Maju & Mandiri',
    heroDesc: 'Rumah Aplikasi menyediakan solusi perangkat lunak terpadu untuk administrasi desa, BUMDes, dan pelayanan masyarakat. Tingkatkan transparansi dan efisiensi desa Anda sekarang.',
    
    aboutTitle: 'Membangun Desa dari Pinggiran',
    aboutDesc: 'Rumah Aplikasi berdedikasi untuk menjembatani kesenjangan teknologi di wilayah pedesaan. Kami merancang sistem yang tidak hanya canggih, tetapi juga sangat mudah digunakan oleh aparatur desa dan masyarakat umum.',
    
    appsTitle: 'Katalog Aplikasi Desa',
    appsDesc: 'Pilih modul aplikasi yang paling dibutuhkan oleh desa Anda saat ini. Sistem kami dapat diintegrasikan satu sama lain.',
    applications: [
      { title: 'Sistem Informasi Desa (SID)', description: 'Manajemen data kependudukan, statistik desa, dan pemetaan wilayah secara digital dan akurat.', url: '' },
      { title: 'Aplikasi Kasir BUMDes', description: 'Kelola unit usaha desa dengan sistem kasir (POS), pencatatan stok, dan laporan laba rugi otomatis.', url: '' },
      { title: 'Layanan Mandiri Warga', description: 'Warga dapat mengajukan surat pengantar dan melakukan pelaporan langsung dari smartphone mereka.', url: '' },
      { title: 'Website Profil Desa', description: 'Publikasi potensi wisata, transparansi dana desa, dan berita terkini untuk masyarakat luas.', url: '' },
      { title: 'Aplikasi Pembukuan BUMDesa', description: 'Sistem informasi manajemen BUMDes untuk pencatatan keuangan dan pembukuan terpadu.', url: 'https://simbumdes.my.id/' }
    ],

    digitalProductsTitle: 'Produk Digital',
    digitalProductsDesc: 'Berbagai produk digital siap pakai untuk kebutuhan administrasi dan operasional desa.',
    digitalProductsItems: [
      { title: 'Template Surat Desa', price: 'Rp 50.000', description: 'Kumpulan template surat menyurat resmi desa format Word.', image: 'https://picsum.photos/seed/digital1/400/300' }
    ],

    villageProductsTitle: 'Produk Desa',
    villageProductsDesc: 'Etalase produk unggulan karya warga desa dan BUMDes.',
    villageProductsItems: [
      { title: 'Kopi Asli Desa', price: 'Rp 35.000', description: 'Kopi robusta petik merah hasil panen petani lokal.', image: 'https://picsum.photos/seed/kopi/400/300' }
    ],

    bumdesProductsTitle: 'Produk Bumdes/Bumdesma',
    bumdesProductsDesc: 'Etalase produk unggulan karya Bumdes/Bumdesma.',
    bumdesProductsItems: [
      { title: 'Produk Bumdes 1', price: 'Rp 50.000', description: 'Deskripsi produk bumdes.', image: 'https://picsum.photos/seed/bumdes/400/300' }
    ],

    kopdesProductsTitle: 'Produk KopDes',
    kopdesProductsDesc: 'Etalase produk unggulan karya Koperasi Desa.',
    kopdesProductsItems: [
      { title: 'Produk KopDes 1', price: 'Rp 50.000', description: 'Deskripsi produk kopdes.', image: 'https://picsum.photos/seed/kopdes/400/300' }
    ],

    documentsTitle: 'Pusat Dokumen',
    documentsDesc: 'Unduh dokumen resmi, formulir, dan regulasi desa.',
    documentsItems: [
      { title: 'Formulir Pendaftaran BUMDes', url: '#', type: 'pdf' },
      { title: 'Peraturan Desa No. 1 Tahun 2026', url: '#', type: 'pdf' }
    ],

    tentangBumdesTitleStart: 'Tentang',
    tentangBumdesTitleHighlight: 'Bumdes',
    tentangBumdesTitleEnd: 'Desa Kita',
    tentangBumdesDesc: 'Informasi lengkap mengenai Badan Usaha Milik Desa.',
    tentangBumdesItems: [
      { title: 'Profil Bumdes', url: '#', type: 'pdf', description: 'Dokumen profil lengkap Bumdes.' }
    ],

    tentangKopdesTitleStart: 'Tentang',
    tentangKopdesTitleHighlight: 'KopDes',
    tentangKopdesTitleEnd: 'Desa Kita',
    tentangKopdesDesc: 'Informasi lengkap mengenai Koperasi Desa.',
    tentangKopdesItems: [
      { title: 'Profil KopDes', url: '#', type: 'pdf', description: 'Dokumen profil lengkap Koperasi Desa.' }
    ],

    tutorialTitle: 'Pusat Tutorial & Panduan',
    tutorialDesc: 'Pelajari cara menggunakan aplikasi kami melalui berbagai format media yang tersedia langsung di dalam website.',
    tutorials: [
      { id: '1', type: 'youtube', title: 'Video YouTube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0' },
      { id: '2', type: 'pdf', title: 'Panduan PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: '3', type: 'ppt', title: 'Slide PowerPoint', url: 'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx' }
    ],

    newsTitle: 'Berita & Update',
    newsDesc: 'Kabar terbaru seputar digitalisasi desa dan pembaruan sistem dari Rumah Aplikasi.',
    newsItems: [
      { title: 'Pelatihan Digitalisasi Desa di Kabupaten Maju', date: '10 April 2026', excerpt: 'Ratusan perangkat desa mengikuti pelatihan intensif penggunaan Sistem Informasi Desa terpadu.', image: 'https://picsum.photos/seed/berita1/400/250' },
      { title: 'BUMDes Makmur Catat Kenaikan Laba 300%', date: '05 April 2026', excerpt: 'Semenjak menggunakan Aplikasi Kasir BUMDes, pencatatan keuangan menjadi lebih transparan.', image: 'https://picsum.photos/seed/berita2/400/250' },
      { title: 'Rilis Fitur Baru: Layanan Surat Online Warga', date: '01 April 2026', excerpt: 'Kini warga dapat mengurus surat pengantar RT/RW langsung dari smartphone masing-masing.', image: 'https://picsum.photos/seed/berita3/400/250' }
    ],

    pricingTitle: 'Investasi Teknologi Desa',
    pricingDesc: 'Skema pembiayaan yang transparan dan dapat disesuaikan dengan Anggaran Pendapatan dan Belanja Desa (APBDes).',
    pricingPlans: [
      { name: 'SaaS Basic', price: 'Rp 250rb', period: '/bln' },
      { name: 'SaaS Pro', price: 'Rp 2,5 Jt', period: '/thn' },
      { name: 'Source Code', price: 'Rp 15 Jt', period: '/sekali' }
    ],

    contactTitle: 'Siap Mendigitalkan Desa Anda?',
    contactDesc: 'Hubungi tim kami untuk konsultasi gratis, presentasi produk, atau negosiasi harga. Kami siap datang ke desa Anda.',
    contactPhone: '+62 812-3456-7890',
    contactEmail: 'halo@rumahaplikasi.desa.id',
    contactAddress: 'Jl. Teknologi Desa No. 1, Jakarta',

    wisataTitle: 'Wisata Desa',
    wisataDesc: 'Jelajahi keindahan alam dan potensi pariwisata yang dikelola langsung oleh desa.',
    wisataItems: [
      { title: 'Air Terjun Indah', description: 'Destinasi wisata alam dengan pemandangan asri.', image: 'https://picsum.photos/seed/wisata1/400/300' }
    ],

    studiTitle: 'Studi Banding',
    studiDesc: 'Program kunjungan dan pembelajaran antar desa untuk berbagi inovasi dan pengalaman.',
    studiItems: [
      { title: 'Paket Studi Banding BUMDes', description: 'Pelajari tata kelola BUMDes yang sukses.', image: 'https://picsum.photos/seed/studi1/400/300' }
    ],

    promosiTitle: 'Promosi Desa',
    promosiDesc: 'Ruang promosi untuk potensi, budaya, dan acara unggulan desa.',
    promosiItems: [
      { title: 'Festival Budaya Desa', description: 'Acara tahunan menampilkan kesenian lokal.', image: 'https://picsum.photos/seed/promosi1/400/300' }
    ]
  }), []);

  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [selectedItemModal, setSelectedItemModal] = useState<any>(null);

  // Firestore integration will be implemented next.
  // For now, we rely on defaultSiteContent to ensure the app loads.
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteContent(docSnap.data() as typeof defaultSiteContent);
        } else {
          // If no content in Firestore, save default content
          await setDoc(docRef, defaultSiteContent);
        }
      } catch (error) {
        console.error('Error fetching content from Firestore:', error);
      }
    };
    fetchContent();
  }, [defaultSiteContent]);

  const saveContent = async () => {
    try {
      // Check size before saving
      const contentSize = new Blob([JSON.stringify(siteContent)]).size;
      if (contentSize > 900000) { // 900KB limit to be safe
        alert('Konten terlalu besar untuk disimpan. Mohon gunakan URL gambar daripada mengunggah gambar secara langsung. Ukuran saat ini: ' + (contentSize / 1024 / 1024).toFixed(2) + ' MB');
        return;
      }

      // Save to Firestore
      const docRef = doc(db, 'siteContent', 'main');
      await setDoc(docRef, siteContent);
      setIsAdminPanelOpen(false);
      alert('Perubahan berhasil disimpan ke Firestore!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Gagal menyimpan perubahan. Pastikan ukuran konten tidak melebihi 1MB.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'Tentang', href: '#tentang', icon: Info },
    { name: 'Aplikasi', href: '#aplikasi', icon: AppWindow },
    { 
      name: 'Produk', 
      icon: ShoppingBag,
      subItems: [
        { name: 'Produk Digital', href: '#produk-digital', icon: Box },
        { name: 'Produk Desa', href: '#produk-desa', icon: ShoppingBag },
        { name: 'Produk Bumdes/Bumdesma', href: '#produk-bumdes', icon: ShoppingBag },
        { name: 'Produk KopDes', href: '#produk-kopdes', icon: ShoppingBag },
      ]
    },
    { 
      name: 'Materi', 
      icon: FileText,
      subItems: [
        { name: 'Dokumen', href: '#dokumen', icon: FileText },
        { name: 'Tentang Bumdes', href: '#tentang-bumdes', icon: Info },
        { name: 'Tentang Kopdes', href: '#tentang-kopdes', icon: Info },
      ]
    },
    { 
      name: 'Potensi Desa', 
      icon: Map,
      subItems: [
        { name: 'Wisata Desa', href: '#wisata', icon: Map },
        { name: 'Studi Banding', href: '#studi', icon: Users },
        { name: 'Promosi Desa', href: '#promosi', icon: Store },
      ]
    },
    { name: 'Tutorial', href: '#tutorial', icon: PlaySquare },
    { name: 'Berita', href: '#berita', icon: Newspaper },
    { name: 'Harga', href: '#harga', icon: ShoppingCart },
    { name: 'Kontak', href: '#kontak', icon: Phone },
    ...(isLoggedIn ? [{
      name: 'Firi',
      icon: User,
      subItems: [
        { name: 'Pekerjaan', href: '#pekerjaan', icon: Briefcase },
        { name: 'Presentasi', href: '#presentasi', icon: Presentation },
        { name: 'Daily Report', href: '#daily-report', icon: FileText },
        { name: 'Rencana Kerja', href: '#rencana-kerja', icon: Calendar },
      ]
    }] : []),
  ];

  const toggleMobileDropdown = (name: string) => {
    if (openMobileDropdown === name) {
      setOpenMobileDropdown(null);
    } else {
      setOpenMobileDropdown(name);
    }
  };

  const appStyles = [
    { icon: Map, color: 'bg-sky-500' },
    { icon: Store, color: 'bg-blue-500' },
    { icon: Users, color: 'bg-green-500' },
    { icon: Globe, color: 'bg-cyan-600' },
  ];

  const handleAppChange = (index: number, field: string, value: string) => {
    const newApps = [...siteContent.applications];
    newApps[index] = { ...newApps[index], [field]: value };
    setSiteContent({ ...siteContent, applications: newApps });
  };

  const addApp = () => {
    setSiteContent({
      ...siteContent,
      applications: [...siteContent.applications, { title: 'Aplikasi Baru', description: 'Deskripsi aplikasi baru', url: '' }]
    });
  };

  const removeApp = (index: number) => {
    const newApps = siteContent.applications.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, applications: newApps });
  };

  const handleDigitalProductChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.digitalProductsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, digitalProductsItems: newItems });
  };

  const addDigitalProduct = () => {
    setSiteContent({
      ...siteContent,
      digitalProductsItems: [...siteContent.digitalProductsItems, { title: 'Produk Baru', price: 'Rp 0', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeDigitalProduct = (index: number) => {
    const newItems = siteContent.digitalProductsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, digitalProductsItems: newItems });
  };

  const handleVillageProductChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.villageProductsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, villageProductsItems: newItems });
  };

  const addVillageProduct = () => {
    setSiteContent({
      ...siteContent,
      villageProductsItems: [...siteContent.villageProductsItems, { title: 'Produk Baru', price: 'Rp 0', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeVillageProduct = (index: number) => {
    const newItems = siteContent.villageProductsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, villageProductsItems: newItems });
  };

  const handleBumdesProductChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.bumdesProductsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, bumdesProductsItems: newItems });
  };

  const addBumdesProduct = () => {
    setSiteContent({
      ...siteContent,
      bumdesProductsItems: [...siteContent.bumdesProductsItems, { title: 'Produk Baru', price: 'Rp 0', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeBumdesProduct = (index: number) => {
    const newItems = siteContent.bumdesProductsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, bumdesProductsItems: newItems });
  };

  const handleKopdesProductChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.kopdesProductsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, kopdesProductsItems: newItems });
  };

  const addKopdesProduct = () => {
    setSiteContent({
      ...siteContent,
      kopdesProductsItems: [...siteContent.kopdesProductsItems, { title: 'Produk Baru', price: 'Rp 0', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeKopdesProduct = (index: number) => {
    const newItems = siteContent.kopdesProductsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, kopdesProductsItems: newItems });
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.documentsItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, documentsItems: newItems });
  };

  const addDocument = () => {
    setSiteContent({
      ...siteContent,
      documentsItems: [...siteContent.documentsItems, { title: 'Dokumen Baru', url: '#', type: 'pdf' }]
    });
  };

  const removeDocument = (index: number) => {
    const newItems = siteContent.documentsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, documentsItems: newItems });
  };

  const handleTentangBumdesChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.tentangBumdesItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, tentangBumdesItems: newItems });
  };

  const addTentangBumdes = () => {
    setSiteContent({
      ...siteContent,
      tentangBumdesItems: [...siteContent.tentangBumdesItems, { title: 'Materi Baru', url: '#', type: 'pdf', description: '' }]
    });
  };

  const removeTentangBumdes = (index: number) => {
    const newItems = siteContent.tentangBumdesItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, tentangBumdesItems: newItems });
  };

  const handleTentangKopdesChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.tentangKopdesItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, tentangKopdesItems: newItems });
  };

  const addTentangKopdes = () => {
    setSiteContent({
      ...siteContent,
      tentangKopdesItems: [...siteContent.tentangKopdesItems, { title: 'Materi Baru', url: '#', type: 'pdf', description: '' }]
    });
  };

  const removeTentangKopdes = (index: number) => {
    const newItems = siteContent.tentangKopdesItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, tentangKopdesItems: newItems });
  };

  const handleWisataChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.wisataItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, wisataItems: newItems });
  };

  const addWisata = () => {
    setSiteContent({
      ...siteContent,
      wisataItems: [...siteContent.wisataItems, { title: 'Wisata Baru', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeWisata = (index: number) => {
    const newItems = siteContent.wisataItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, wisataItems: newItems });
  };

  const handleStudiChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.studiItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, studiItems: newItems });
  };

  const addStudi = () => {
    setSiteContent({
      ...siteContent,
      studiItems: [...siteContent.studiItems, { title: 'Paket Baru', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removeStudi = (index: number) => {
    const newItems = siteContent.studiItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, studiItems: newItems });
  };

  const handlePromosiChange = (index: number, field: string, value: string) => {
    const newItems = [...siteContent.promosiItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setSiteContent({ ...siteContent, promosiItems: newItems });
  };

  const addPromosi = () => {
    setSiteContent({
      ...siteContent,
      promosiItems: [...siteContent.promosiItems, { title: 'Promosi Baru', description: 'Deskripsi', image: 'https://picsum.photos/seed/new/400/300' }]
    });
  };

  const removePromosi = (index: number) => {
    const newItems = siteContent.promosiItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, promosiItems: newItems });
  };

  const handleTutorialChange = (index: number, field: string, value: string) => {
    const newTutorials = [...siteContent.tutorials];
    newTutorials[index] = { ...newTutorials[index], [field]: value };
    setSiteContent({ ...siteContent, tutorials: newTutorials });
  };

  const addTutorial = () => {
    setSiteContent({
      ...siteContent,
      tutorials: [...siteContent.tutorials, { id: Date.now().toString(), type: 'youtube', title: 'Tutorial Baru', url: '' }]
    });
  };

  const removeTutorial = (index: number) => {
    const newTutorials = siteContent.tutorials.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, tutorials: newTutorials });
  };

  const handleNewsChange = (index: number, field: string, value: string) => {
    const newNews = [...siteContent.newsItems];
    newNews[index] = { ...newNews[index], [field]: value };
    setSiteContent({ ...siteContent, newsItems: newNews });
  };

  const addNews = () => {
    setSiteContent({
      ...siteContent,
      newsItems: [...siteContent.newsItems, { title: 'Berita Baru', date: 'Tanggal', excerpt: 'Kutipan berita...', image: 'https://picsum.photos/seed/new/400/250' }]
    });
  };

  const removeNews = (index: number) => {
    const newNews = siteContent.newsItems.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, newsItems: newNews });
  };

  const handlePricingChange = (index: number, field: string, value: string) => {
    const newPricing = [...siteContent.pricingPlans];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setSiteContent({ ...siteContent, pricingPlans: newPricing });
  };

  const addPricing = () => {
    setSiteContent({
      ...siteContent,
      pricingPlans: [...siteContent.pricingPlans, { name: 'Paket Baru', price: 'Rp 0', period: '/bln' }]
    });
  };

  const removePricing = (index: number) => {
    const newPricing = siteContent.pricingPlans.filter((_, i) => i !== index);
    setSiteContent({ ...siteContent, pricingPlans: newPricing });
  };

  const handleWhatsAppClick = (itemName: string) => {
    const phoneNumber = siteContent.contactPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Halo, saya tertarik dan ingin bertanya lebih lanjut mengenai ${itemName} yang ada di website Rumah Aplikasi.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-200 selection:text-sky-900">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-sky-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo area */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-sky-100 bg-sky-50 flex items-center justify-center">
                <img 
                  src={siteContent.logo} 
                  alt="Logo Rumah Aplikasi" 
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Globe className="hidden absolute text-sky-600 w-6 h-6 z-0" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-gray-900 leading-none tracking-tight">RUMAH</span>
                <span className="font-heading font-bold text-xl text-sky-600 leading-none tracking-tight">APLIKASI</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex space-x-6 items-center">
              {navLinks.map((link) => (
                link.subItems ? (
                  <div key={link.name} className="relative group">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-sky-600 font-medium text-sm transition-colors duration-200">
                      {link.name}
                      <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                      {link.subItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                        >
                          <subItem.icon size={16} />
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-sky-600 font-medium text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md shadow-blue-600/20"
                  >
                    <Settings size={18} />
                    Panel Admin
                  </button>
                  <button 
                    onClick={() => { setIsLoggedIn(false); setIsAdminPanelOpen(false); alert('Berhasil keluar dari sistem.'); }}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md shadow-red-500/20"
                  >
                    <LogIn size={18} className="rotate-180" />
                    Keluar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-md shadow-sky-600/20"
                >
                  <LogIn size={18} />
                  Masuk
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="text-blue-600 font-medium flex items-center gap-1"
                  >
                    <Settings size={20} />
                  </button>
                  <button 
                    onClick={() => { setIsLoggedIn(false); setIsAdminPanelOpen(false); alert('Berhasil keluar dari sistem.'); }}
                    className="text-red-500 font-medium flex items-center gap-1"
                  >
                    <LogIn size={20} className="rotate-180" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sky-600 font-medium flex items-center gap-1"
                >
                  <LogIn size={20} />
                  <span className="hidden sm:inline">Masuk</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-sky-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-sky-50 shadow-lg overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  link.subItems ? (
                    <div key={link.name}>
                      <button
                        onClick={() => toggleMobileDropdown(link.name)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon size={20} className="text-sky-500" />
                          {link.name}
                        </div>
                        <ChevronDown size={18} className={`transition-transform ${openMobileDropdown === link.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openMobileDropdown === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-10 pr-3"
                          >
                            {link.subItems.map((subItem) => (
                              <a
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors"
                              >
                                <subItem.icon size={16} className="text-sky-400" />
                                {subItem.name}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <link.icon size={20} className="text-sky-500" />
                      {link.name}
                    </a>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-sky-600 p-6 text-white text-center relative">
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-4 right-4 text-sky-200 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <Lock size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold font-heading">Login Sistem</h3>
                <p className="text-sky-100 text-sm mt-2">Masuk untuk mengelola aplikasi desa</p>
              </div>
              
              <div className="p-8">
                <form className="space-y-5" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if (username === 'owner' && password === 'firi9182') {
                    setIsLoggedIn(true);
                    setIsLoginModalOpen(false);
                    setLoginError('');
                    setUsername('');
                    setPassword('');
                    alert('Selamat datang, Owner! Anda sekarang memiliki akses penuh.');
                  } else {
                    setLoginError('Username atau Password salah!');
                  }
                }}>
                  {loginError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" 
                        placeholder="Masukkan username" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-sky-600/30">
                    Masuk ke Dashboard
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel Sidebar */}
      <AnimatePresence>
        {isLoggedIn && isAdminPanelOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminPanelOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Editor Tampilan</h2>
                    <p className="text-xs text-gray-500">Ubah konten website secara langsung</p>
                  </div>
                </div>
                <button onClick={() => setIsAdminPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-0 bg-gray-50/50">
                {/* Admin Tabs */}
                <div className="flex justify-center overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10 scrollbar-hide shadow-sm">
                  <div className="flex">
                    {['home', 'tentang', 'aplikasi', 'produk digital', 'produk desa', 'produk bumdes', 'produk kopdes', 'dokumen', 'tentang bumdes', 'tentang kopdes', 'wisata', 'studi banding', 'promosi', 'tutorial', 'berita', 'harga', 'kontak'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveAdminTab(tab)}
                        className={`px-4 py-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${activeAdminTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 bg-white min-h-full shadow-sm border-x border-gray-100">
                  {/* Home Edit */}
                  {activeAdminTab === 'home' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Home (Hero)</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Logo Website</label>
                        <div className="flex items-center gap-3 mt-1">
                          <img src={siteContent.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover border" />
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <ImageIcon size={16} /> Ganti Logo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setSiteContent({...siteContent, logo: base64}))} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Gambar Background (Opsional)</label>
                        <div className="flex items-center gap-3 mt-1">
                          {siteContent.heroBgImage && <img src={siteContent.heroBgImage} alt="Bg" className="w-16 h-10 rounded-lg object-cover border" />}
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <ImageIcon size={16} /> Ganti Background
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setSiteContent({...siteContent, heroBgImage: base64}))} />
                          </label>
                          {siteContent.heroBgImage && (
                            <button onClick={() => setSiteContent({...siteContent, heroBgImage: ''})} className="text-xs text-red-500 hover:text-red-700">Hapus</button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Foto Ilustrasi</label>
                        <div className="flex items-center gap-3 mt-1">
                          <img src={siteContent.heroImage} alt="Hero" className="w-16 h-10 rounded-lg object-cover border" />
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <ImageIcon size={16} /> Ganti Foto
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => setSiteContent({...siteContent, heroImage: base64}))} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Awal</label>
                        <input type="text" value={siteContent.heroTitleStart} onChange={(e) => setSiteContent({...siteContent, heroTitleStart: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Highlight (Warna)</label>
                        <input type="text" value={siteContent.heroTitleHighlight} onChange={(e) => setSiteContent({...siteContent, heroTitleHighlight: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Akhir</label>
                        <input type="text" value={siteContent.heroTitleEnd} onChange={(e) => setSiteContent({...siteContent, heroTitleEnd: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Hero</label>
                        <textarea rows={3} value={siteContent.heroDesc} onChange={(e) => setSiteContent({...siteContent, heroDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                    </div>
                  )}

                  {/* About Edit */}
                  {activeAdminTab === 'tentang' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Tentang</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Tentang</label>
                        <input type="text" value={siteContent.aboutTitle} onChange={(e) => setSiteContent({...siteContent, aboutTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Tentang</label>
                        <textarea rows={4} value={siteContent.aboutDesc} onChange={(e) => setSiteContent({...siteContent, aboutDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                    </div>
                  )}

                  {/* Aplikasi Edit */}
                  {activeAdminTab === 'aplikasi' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Aplikasi</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.appsTitle} onChange={(e) => setSiteContent({...siteContent, appsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.appsDesc} onChange={(e) => setSiteContent({...siteContent, appsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Aplikasi</h4>
                          <button onClick={addApp} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.applications.map((app, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeApp(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Aplikasi</label>
                              <input type="text" value={app.title} onChange={(e) => handleAppChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={app.description} onChange={(e) => handleAppChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(app as any).detailExplanation || ''} onChange={(e) => handleAppChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail tentang aplikasi ini..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={app.url || ''} onChange={(e) => handleAppChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produk Digital Edit */}
                  {activeAdminTab === 'produk digital' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Produk Digital</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.digitalProductsTitle} onChange={(e) => setSiteContent({...siteContent, digitalProductsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.digitalProductsDesc} onChange={(e) => setSiteContent({...siteContent, digitalProductsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Produk Digital</h4>
                          <button onClick={addDigitalProduct} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.digitalProductsItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeDigitalProduct(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Produk</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Product" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleDigitalProductChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Produk</label>
                              <input type="text" value={item.title} onChange={(e) => handleDigitalProductChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Harga</label>
                              <input type="text" value={item.price} onChange={(e) => handleDigitalProductChange(idx, 'price', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={item.description} onChange={(e) => handleDigitalProductChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleDigitalProductChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleDigitalProductChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produk Desa Edit */}
                  {activeAdminTab === 'produk desa' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Produk Desa</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.villageProductsTitle} onChange={(e) => setSiteContent({...siteContent, villageProductsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.villageProductsDesc} onChange={(e) => setSiteContent({...siteContent, villageProductsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Produk Desa</h4>
                          <button onClick={addVillageProduct} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.villageProductsItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeVillageProduct(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Produk</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Product" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleVillageProductChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Produk</label>
                              <input type="text" value={item.title} onChange={(e) => handleVillageProductChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Harga</label>
                              <input type="text" value={item.price} onChange={(e) => handleVillageProductChange(idx, 'price', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={item.description} onChange={(e) => handleVillageProductChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleVillageProductChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleVillageProductChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produk KopDes Edit */}
                  {activeAdminTab === 'produk kopdes' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Produk KopDes</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.kopdesProductsTitle} onChange={(e) => setSiteContent({...siteContent, kopdesProductsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.kopdesProductsDesc} onChange={(e) => setSiteContent({...siteContent, kopdesProductsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Produk KopDes</h4>
                          <button onClick={addKopdesProduct} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.kopdesProductsItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeKopdesProduct(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Produk</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Product" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleKopdesProductChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Produk</label>
                              <input type="text" value={item.title} onChange={(e) => handleKopdesProductChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Harga</label>
                              <input type="text" value={item.price} onChange={(e) => handleKopdesProductChange(idx, 'price', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={(item as any).description || ''} onChange={(e) => handleKopdesProductChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleKopdesProductChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleKopdesProductChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produk Bumdes Edit */}
                  {activeAdminTab === 'produk bumdes' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Produk Bumdes/Bumdesma</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.bumdesProductsTitle} onChange={(e) => setSiteContent({...siteContent, bumdesProductsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.bumdesProductsDesc} onChange={(e) => setSiteContent({...siteContent, bumdesProductsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Produk Bumdes</h4>
                          <button onClick={addBumdesProduct} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.bumdesProductsItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeBumdesProduct(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Produk</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Product" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleBumdesProductChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Produk</label>
                              <input type="text" value={item.title} onChange={(e) => handleBumdesProductChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Harga</label>
                              <input type="text" value={item.price} onChange={(e) => handleBumdesProductChange(idx, 'price', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={(item as any).description || ''} onChange={(e) => handleBumdesProductChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleBumdesProductChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleBumdesProductChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dokumen Edit */}
                  {activeAdminTab === 'dokumen' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Dokumen</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.documentsTitle} onChange={(e) => setSiteContent({...siteContent, documentsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.documentsDesc} onChange={(e) => setSiteContent({...siteContent, documentsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Dokumen</h4>
                          <button onClick={addDocument} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.documentsItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeDocument(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Dokumen</label>
                              <input type="text" value={item.title} onChange={(e) => handleDocumentChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Download</label>
                              <input type="text" value={item.url} onChange={(e) => handleDocumentChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat (Opsional)</label>
                              <textarea rows={2} value={(item as any).description || ''} onChange={(e) => handleDocumentChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleDocumentChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tipe Dokumen</label>
                              <select value={item.type} onChange={(e) => handleDocumentChange(idx, 'type', e.target.value)} className="w-full p-1.5 border rounded text-sm">
                                <option value="pdf">PDF</option>
                                <option value="word">Word / Doc</option>
                                <option value="excel">Excel</option>
                                <option value="ppt">PowerPoint</option>
                                <option value="other">Lainnya</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tentang Bumdes Edit */}
                  {activeAdminTab === 'tentang bumdes' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Tentang Bumdes</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Awal</label>
                          <input type="text" value={siteContent.tentangBumdesTitleStart} onChange={(e) => setSiteContent({...siteContent, tentangBumdesTitleStart: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Highlight (Warna)</label>
                          <input type="text" value={siteContent.tentangBumdesTitleHighlight} onChange={(e) => setSiteContent({...siteContent, tentangBumdesTitleHighlight: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Akhir</label>
                          <input type="text" value={siteContent.tentangBumdesTitleEnd} onChange={(e) => setSiteContent({...siteContent, tentangBumdesTitleEnd: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.tentangBumdesDesc} onChange={(e) => setSiteContent({...siteContent, tentangBumdesDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Materi Bumdes</h4>
                          <button onClick={addTentangBumdes} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.tentangBumdesItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeTentangBumdes(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Judul Tab / Materi</label>
                              <input type="text" value={item.title} onChange={(e) => handleTentangBumdesChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Download</label>
                              <input type="text" value={item.url} onChange={(e) => handleTentangBumdesChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat (Opsional)</label>
                              <textarea rows={2} value={(item as any).description || ''} onChange={(e) => handleTentangBumdesChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleTentangBumdesChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tipe Materi</label>
                              <select value={item.type} onChange={(e) => handleTentangBumdesChange(idx, 'type', e.target.value)} className="w-full p-1.5 border rounded text-sm">
                                <option value="pdf">PDF</option>
                                <option value="word">Word / Doc</option>
                                <option value="excel">Excel</option>
                                <option value="ppt">PowerPoint</option>
                                <option value="video">Video</option>
                                <option value="other">Lainnya</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tentang Kopdes Edit */}
                  {activeAdminTab === 'tentang kopdes' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Tentang Kopdes</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Awal</label>
                          <input type="text" value={siteContent.tentangKopdesTitleStart} onChange={(e) => setSiteContent({...siteContent, tentangKopdesTitleStart: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Highlight (Warna)</label>
                          <input type="text" value={siteContent.tentangKopdesTitleHighlight} onChange={(e) => setSiteContent({...siteContent, tentangKopdesTitleHighlight: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Judul Akhir</label>
                          <input type="text" value={siteContent.tentangKopdesTitleEnd} onChange={(e) => setSiteContent({...siteContent, tentangKopdesTitleEnd: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.tentangKopdesDesc} onChange={(e) => setSiteContent({...siteContent, tentangKopdesDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Materi Kopdes</h4>
                          <button onClick={addTentangKopdes} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.tentangKopdesItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeTentangKopdes(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Judul Tab / Materi</label>
                              <input type="text" value={item.title} onChange={(e) => handleTentangKopdesChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Download</label>
                              <input type="text" value={item.url} onChange={(e) => handleTentangKopdesChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat (Opsional)</label>
                              <textarea rows={2} value={(item as any).description || ''} onChange={(e) => handleTentangKopdesChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleTentangKopdesChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tipe Materi</label>
                              <select value={item.type} onChange={(e) => handleTentangKopdesChange(idx, 'type', e.target.value)} className="w-full p-1.5 border rounded text-sm">
                                <option value="pdf">PDF</option>
                                <option value="word">Word / Doc</option>
                                <option value="excel">Excel</option>
                                <option value="ppt">PowerPoint</option>
                                <option value="video">Video</option>
                                <option value="other">Lainnya</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wisata Edit */}
                  {activeAdminTab === 'wisata' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Wisata Desa</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.wisataTitle} onChange={(e) => setSiteContent({...siteContent, wisataTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.wisataDesc} onChange={(e) => setSiteContent({...siteContent, wisataDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Wisata</h4>
                          <button onClick={addWisata} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.wisataItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeWisata(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Wisata</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Wisata" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleWisataChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Wisata</label>
                              <input type="text" value={item.title} onChange={(e) => handleWisataChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={item.description} onChange={(e) => handleWisataChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleWisataChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleWisataChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Studi Banding Edit */}
                  {activeAdminTab === 'studi banding' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Studi Banding</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.studiTitle} onChange={(e) => setSiteContent({...siteContent, studiTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.studiDesc} onChange={(e) => setSiteContent({...siteContent, studiDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Paket Studi Banding</h4>
                          <button onClick={addStudi} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.studiItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeStudi(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Paket</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Studi" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleStudiChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Paket</label>
                              <input type="text" value={item.title} onChange={(e) => handleStudiChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={item.description} onChange={(e) => handleStudiChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handleStudiChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handleStudiChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promosi Edit */}
                  {activeAdminTab === 'promosi' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Promosi Desa</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.promosiTitle} onChange={(e) => setSiteContent({...siteContent, promosiTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.promosiDesc} onChange={(e) => setSiteContent({...siteContent, promosiDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Promosi</h4>
                          <button onClick={addPromosi} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.promosiItems.map((item, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removePromosi(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Promosi</label>
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt="Promosi" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handlePromosiChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Promosi</label>
                              <input type="text" value={item.title} onChange={(e) => handlePromosiChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Deskripsi Singkat</label>
                              <textarea rows={2} value={item.description} onChange={(e) => handlePromosiChange(idx, 'description', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Penjelasan Detail (Muncul di Modal)</label>
                              <textarea rows={3} value={(item as any).detailExplanation || ''} onChange={(e) => handlePromosiChange(idx, 'detailExplanation', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="Jelaskan lebih detail..." />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">URL / Link Web Demo (Opsional)</label>
                              <input type="text" value={(item as any).url || ''} onChange={(e) => handlePromosiChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tutorial Edit */}
                  {activeAdminTab === 'tutorial' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Tutorial</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Tutorial</label>
                        <input type="text" value={siteContent.tutorialTitle} onChange={(e) => setSiteContent({...siteContent, tutorialTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Tutorial</label>
                        <textarea rows={3} value={siteContent.tutorialDesc} onChange={(e) => setSiteContent({...siteContent, tutorialDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>

                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Tutorial</h4>
                          <button onClick={addTutorial} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.tutorials.map((tut, idx) => (
                          <div key={tut.id} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeTutorial(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Judul Tab</label>
                              <input type="text" value={tut.title} onChange={(e) => handleTutorialChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tipe</label>
                                <select value={tut.type} onChange={(e) => handleTutorialChange(idx, 'type', e.target.value)} className="w-full p-1.5 border rounded text-sm bg-white">
                                  <option value="youtube">YouTube</option>
                                  <option value="pdf">PDF</option>
                                  <option value="ppt">PowerPoint</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">URL / Link</label>
                                <input type="text" value={tut.url} onChange={(e) => handleTutorialChange(idx, 'url', e.target.value)} className="w-full p-1.5 border rounded text-sm" placeholder="https://..." />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Berita Edit */}
                  {activeAdminTab === 'berita' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Berita</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.newsTitle} onChange={(e) => setSiteContent({...siteContent, newsTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.newsDesc} onChange={(e) => setSiteContent({...siteContent, newsDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Daftar Berita</h4>
                          <button onClick={addNews} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.newsItems.map((news, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removeNews(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"><Trash2 size={16}/></button>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Gambar Berita</label>
                              <div className="flex items-center gap-3">
                                <img src={news.image} alt="News" className="w-16 h-10 object-cover rounded border" />
                                <label className="cursor-pointer bg-white border hover:bg-gray-50 px-2 py-1 rounded text-xs transition-colors">
                                  Ganti Gambar
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (base64) => handleNewsChange(idx, 'image', base64))} />
                                </label>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Judul Berita</label>
                              <input type="text" value={news.title} onChange={(e) => handleNewsChange(idx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                              <input type="text" value={news.date} onChange={(e) => handleNewsChange(idx, 'date', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Kutipan</label>
                              <textarea rows={2} value={news.excerpt} onChange={(e) => handleNewsChange(idx, 'excerpt', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Harga Edit */}
                  {activeAdminTab === 'harga' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Harga</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Bagian</label>
                        <input type="text" value={siteContent.pricingTitle} onChange={(e) => setSiteContent({...siteContent, pricingTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Bagian</label>
                        <textarea rows={2} value={siteContent.pricingDesc} onChange={(e) => setSiteContent({...siteContent, pricingDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-sm text-gray-700">Paket Harga</h4>
                          <button onClick={addPricing} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"><Plus size={14}/> Tambah</button>
                        </div>
                        {siteContent.pricingPlans.map((plan, idx) => (
                          <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2 relative">
                            <button onClick={() => removePricing(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Paket</label>
                              <input type="text" value={plan.name} onChange={(e) => handlePricingChange(idx, 'name', e.target.value)} className="w-full p-1.5 border rounded text-sm pr-8" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Harga</label>
                                <input type="text" value={plan.price} onChange={(e) => handlePricingChange(idx, 'price', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Periode</label>
                                <input type="text" value={plan.period} onChange={(e) => handlePricingChange(idx, 'period', e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Edit */}
                  {activeAdminTab === 'kontak' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 border-b pb-2">Bagian Kontak</h3>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Judul Kontak</label>
                        <input type="text" value={siteContent.contactTitle} onChange={(e) => setSiteContent({...siteContent, contactTitle: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Deskripsi Kontak</label>
                        <textarea rows={2} value={siteContent.contactDesc} onChange={(e) => setSiteContent({...siteContent, contactDesc: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Nomor Telepon</label>
                        <input type="text" value={siteContent.contactPhone} onChange={(e) => setSiteContent({...siteContent, contactPhone: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input type="text" value={siteContent.contactEmail} onChange={(e) => setSiteContent({...siteContent, contactEmail: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Alamat</label>
                        <input type="text" value={siteContent.contactAddress} onChange={(e) => setSiteContent({...siteContent, contactAddress: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <button onClick={saveContent} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                  <Save size={20} /> Simpan Perubahan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section id="home" className="relative pt-20 pb-32 overflow-hidden">
          {siteContent.heroBgImage ? (
            <div className="absolute inset-0 -z-10">
              <img src={siteContent.heroBgImage} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50 -z-10" />
          )}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 font-medium text-sm mb-6 border border-sky-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  Smart Village Solutions
                </div>
                <h1 className="font-heading text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                  {siteContent.heroTitleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-500">{siteContent.heroTitleHighlight}</span> {siteContent.heroTitleEnd}
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {siteContent.heroDesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#aplikasi" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:-translate-y-1">
                    Lihat Aplikasi Desa
                  </a>
                  <a href="#tutorial" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all">
                    <PlaySquare className="mr-2" size={20} /> Tonton Tutorial
                  </a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-sky-100 to-blue-50 absolute -inset-4 blur-3xl opacity-50" />
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-sky-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src={siteContent.heroImage} 
                    alt="Ilustrasi Smart Village" 
                    className="rounded-2xl object-cover w-full h-full aspect-[4/3]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tentang Section */}
        <section id="tentang" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.aboutTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600 leading-relaxed">
                {siteContent.aboutDesc}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Sesuai Regulasi', desc: 'Sistem dirancang mengikuti standar administrasi pemerintahan desa terbaru.', icon: FileText },
                { title: 'Pendampingan Penuh', desc: 'Kami memberikan pelatihan dan pendampingan teknis hingga aparatur desa mahir.', icon: Users },
                { title: 'Ramah Anggaran', desc: 'Pilihan harga yang fleksibel dan dapat disesuaikan dengan RAB Dana Desa.', icon: Store }
              ].map((feature, idx) => (
                <div key={idx} className="bg-sky-50/50 rounded-3xl p-8 border border-sky-100 hover:shadow-xl hover:bg-white transition-all duration-300 group">
                  <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aplikasi Section */}
        <section id="aplikasi" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.appsTitle}</h2>
                <p className="text-lg text-gray-600">{siteContent.appsDesc}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteContent.applications.map((app, idx) => {
                const style = appStyles[idx % appStyles.length];
                const Icon = style.icon;
                
                const CardContent = (
                  <>
                    <div className={`w-14 h-14 ${style.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${style.color.split('-')[1]}-500/30`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">{app.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{app.description}</p>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">Siap Pakai</span>
                      <span className="text-sky-600 group-hover:text-sky-800 flex items-center gap-1 text-sm font-medium transition-colors">
                        Aksi <ChevronRight size={14} />
                      </span>
                    </div>
                  </>
                );

                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedItemModal(app)}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer"
                  >
                    {CardContent}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Produk Digital Section */}
        <section id="produk-digital" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.digitalProductsTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.digitalProductsDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.digitalProductsItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sky-600 shadow-sm">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 font-semibold rounded-xl hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> Detail Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Produk Desa Section */}
        <section id="produk-desa" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.villageProductsTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.villageProductsDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.villageProductsItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sky-600 shadow-sm">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 font-semibold rounded-xl hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> Detail Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Produk Bumdes Section */}
        <section id="produk-bumdes" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.bumdesProductsTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.bumdesProductsDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.bumdesProductsItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sky-600 shadow-sm">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{(item as any).description}</p>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 font-semibold rounded-xl hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> Detail Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Produk KopDes Section */}
        <section id="produk-kopdes" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.kopdesProductsTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.kopdesProductsDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.kopdesProductsItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sky-600 shadow-sm">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{(item as any).description}</p>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 font-semibold rounded-xl hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> Detail Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wisata Desa Section */}
        <section id="wisata" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.wisataTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.wisataDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.wisataItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow mb-4">{item.description}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                      <span className="text-sky-600 group-hover:text-sky-800 flex items-center gap-1 text-sm font-medium transition-colors">
                        Detail <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Studi Banding Section */}
        <section id="studi" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.studiTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.studiDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.studiItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 font-semibold rounded-xl hover:bg-sky-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <Users size={18} /> Detail Program
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promosi Desa Section */}
        <section id="promosi" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.promosiTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.promosiDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteContent.promosiItems?.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItemModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow mb-4">{item.description}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                      <span className="text-sky-600 group-hover:text-sky-800 flex items-center gap-1 text-sm font-medium transition-colors">
                        Detail <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dokumen Section */}
        <section id="dokumen" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.documentsTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.documentsDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.documentsItems?.map((item, idx) => {
                let Icon = FileText;
                let colorClass = 'text-gray-500 bg-gray-100';
                if (item.type === 'pdf') { colorClass = 'text-red-500 bg-red-100'; }
                if (item.type === 'word') { colorClass = 'text-blue-500 bg-blue-100'; }
                if (item.type === 'excel') { colorClass = 'text-green-500 bg-green-100'; }
                if (item.type === 'ppt') { colorClass = 'text-orange-500 bg-orange-100'; }

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItemModal(item)}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">{item.type}</p>
                      {(item as any).description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{(item as any).description}</p>}
                    </div>
                    <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="text-sky-500" size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tentang Bumdes Section */}
        <section id="tentang-bumdes" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {siteContent.tentangBumdesTitleStart} <span className="text-sky-600">{siteContent.tentangBumdesTitleHighlight}</span> {siteContent.tentangBumdesTitleEnd}
              </h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.tentangBumdesDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.tentangBumdesItems?.map((item, idx) => {
                let Icon = FileText;
                let colorClass = 'text-gray-500 bg-gray-100';
                if (item.type === 'pdf') { colorClass = 'text-red-500 bg-red-100'; }
                if (item.type === 'word') { colorClass = 'text-blue-500 bg-blue-100'; }
                if (item.type === 'excel') { colorClass = 'text-green-500 bg-green-100'; }
                if (item.type === 'ppt') { colorClass = 'text-orange-500 bg-orange-100'; }
                if (item.type === 'video') { Icon = PlaySquare; colorClass = 'text-purple-500 bg-purple-100'; }

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItemModal(item)}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">{item.type}</p>
                      {(item as any).description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{(item as any).description}</p>}
                    </div>
                    <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="text-sky-500" size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tentang Kopdes Section */}
        <section id="tentang-kopdes" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {siteContent.tentangKopdesTitleStart} <span className="text-sky-600">{siteContent.tentangKopdesTitleHighlight}</span> {siteContent.tentangKopdesTitleEnd}
              </h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.tentangKopdesDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.tentangKopdesItems?.map((item, idx) => {
                let Icon = FileText;
                let colorClass = 'text-gray-500 bg-gray-100';
                if (item.type === 'pdf') { colorClass = 'text-red-500 bg-red-100'; }
                if (item.type === 'word') { colorClass = 'text-blue-500 bg-blue-100'; }
                if (item.type === 'excel') { colorClass = 'text-green-500 bg-green-100'; }
                if (item.type === 'ppt') { colorClass = 'text-orange-500 bg-orange-100'; }
                if (item.type === 'video') { Icon = PlaySquare; colorClass = 'text-purple-500 bg-purple-100'; }

                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedItemModal(item)}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">{item.type}</p>
                      {(item as any).description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{(item as any).description}</p>}
                    </div>
                    <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="text-sky-500" size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tutorial Section */}
        <section id="tutorial" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.tutorialTitle}</h2>
              <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full mb-6" />
              <p className="text-lg text-gray-600">{siteContent.tutorialDesc}</p>
            </div>

            <div className="bg-gray-50 rounded-3xl p-4 md:p-8 border border-gray-200">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {siteContent.tutorials.map((tut) => {
                  let Icon = PlaySquare;
                  let colorClass = 'bg-gray-500';
                  if (tut.type === 'youtube') { Icon = Youtube; colorClass = 'bg-red-500'; }
                  if (tut.type === 'pdf') { Icon = FileDown; colorClass = 'bg-orange-500'; }
                  if (tut.type === 'ppt') { Icon = Presentation; colorClass = 'bg-blue-600'; }

                  return (
                    <button 
                      key={tut.id}
                      onClick={() => setActiveTutorialTab(tut.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTutorialTab === tut.id ? `${colorClass} text-white shadow-lg` : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <Icon size={20} /> {tut.title}
                    </button>
                  );
                })}
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 aspect-video md:aspect-[21/9] flex items-center justify-center relative">
                {siteContent.tutorials.map((tut) => {
                  if (activeTutorialTab !== tut.id) return null;
                  
                  if (tut.type === 'youtube') {
                    return (
                      <iframe 
                        key={tut.id}
                        className="w-full h-full absolute inset-0" 
                        src={tut.url || "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"} 
                        title={tut.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    );
                  }
                  
                  if (tut.type === 'pdf' || tut.type === 'ppt') {
                    const viewerUrl = tut.url ? `https://docs.google.com/gview?url=${encodeURIComponent(tut.url)}&embedded=true` : '';
                    return (
                      <div key={tut.id} className="w-full h-full absolute inset-0 flex flex-col">
                        {tut.url ? (
                          <iframe 
                            src={viewerUrl} 
                            className="w-full flex-grow border-0"
                            title={tut.title}
                          />
                        ) : (
                          <div className="flex-grow flex items-center justify-center bg-gray-100 text-gray-500">
                            URL belum diatur
                          </div>
                        )}
                        <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{tut.title}</span>
                          <a href={tut.url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1">
                            Buka di Tab Baru <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Berita Section */}
        <section id="berita" className="py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.newsTitle}</h2>
                <p className="text-lg text-gray-600">{siteContent.newsDesc}</p>
              </div>
              <button className="hidden md:inline-flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700">
                Lihat Semua Berita <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {siteContent.newsItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-sky-600 font-medium mb-3">{item.date}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{item.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Harga Section */}
        <section id="harga" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">{siteContent.pricingTitle}</h2>
              <p className="text-lg text-gray-600">{siteContent.pricingDesc}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Bulanan */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-6 w-fit">
                  <Clock size={14} /> Langganan Bulanan
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{siteContent.pricingPlans[0].name}</h3>
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-3xl font-black text-gray-900">{siteContent.pricingPlans[0].price}</span>
                  <span className="text-gray-500 text-sm"> {siteContent.pricingPlans[0].period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow text-sm">
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Server ditanggung</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Update gratis</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-blue-500 shrink-0" /> Support standar</li>
                </ul>
                <button className="w-full py-3 rounded-xl font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">Pilih Paket</button>
              </div>

              {/* Tahunan */}
              <div className="bg-white rounded-3xl p-8 border-2 border-sky-500 shadow-xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">
                  Paling Hemat
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-6 mt-2 w-fit">
                  <Clock size={14} /> Langganan Tahunan
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{siteContent.pricingPlans[1].name}</h3>
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-3xl font-black text-gray-900">{siteContent.pricingPlans[1].price}</span>
                  <span className="text-gray-500 text-sm"> {siteContent.pricingPlans[1].period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow text-sm">
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-500 shrink-0" /> Hemat 2 bulan</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-500 shrink-0" /> Domain desa.id</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-500 shrink-0" /> Support prioritas</li>
                </ul>
                <button className="w-full py-3 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-lg">Pilih Paket</button>
              </div>

              {/* Beli Putus */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs mb-6 w-fit">
                  <ShoppingCart size={14} /> Beli Putus
                </div>
                <h3 className="text-2xl font-extrabold mb-2">{siteContent.pricingPlans[2].name}</h3>
                <div className="mb-6 pb-6 border-b border-gray-700">
                  <span className="text-3xl font-black">{siteContent.pricingPlans[2].price}</span>
                  <span className="text-gray-400 text-sm"> {siteContent.pricingPlans[2].period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow text-sm text-gray-300">
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-400 shrink-0" /> 100% Hak Milik</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-400 shrink-0" /> Bebas modifikasi</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-sky-400 shrink-0" /> Instal di server desa</li>
                </ul>
                <button className="w-full py-3 rounded-xl font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors">Hubungi Sales</button>
              </div>

              {/* Nego Harga */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-xs mb-6 w-fit">
                  <Handshake size={14} /> Custom
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Nego Harga</h3>
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-2xl font-black text-gray-900">Sesuai RAB</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow text-sm">
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-orange-500 shrink-0" /> Fitur custom</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-orange-500 shrink-0" /> Menyesuaikan budget</li>
                  <li className="flex gap-2"><CheckCircle2 size={18} className="text-orange-500 shrink-0" /> Konsultasi gratis</li>
                </ul>
                <button className="w-full py-3 rounded-xl font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200">Nego Sekarang</button>
              </div>

            </div>
          </div>
        </section>

        {/* Kontak Person Section */}
        <section id="kontak" className="py-24 bg-sky-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">{siteContent.contactTitle}</h2>
                <p className="text-sky-100 text-lg mb-8 max-w-lg">
                  {siteContent.contactDesc}
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-800 rounded-full flex items-center justify-center">
                      <Phone size={24} className="text-sky-300" />
                    </div>
                    <div>
                      <p className="text-sm text-sky-300">Telepon / WhatsApp</p>
                      <p className="text-xl font-bold">{siteContent.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-800 rounded-full flex items-center justify-center">
                      <Mail size={24} className="text-sky-300" />
                    </div>
                    <div>
                      <p className="text-sm text-sky-300">Email</p>
                      <p className="text-xl font-bold">{siteContent.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-800 rounded-full flex items-center justify-center">
                      <Map size={24} className="text-sky-300" />
                    </div>
                    <div>
                      <p className="text-sm text-sky-300">Kantor Pusat</p>
                      <p className="text-lg font-medium">{siteContent.contactAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Kirim Pesan Cepat</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap / Instansi</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" placeholder="Misal: Budi - Kepala Desa Sukamaju" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" placeholder="0812..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Pertanyaan</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all" placeholder="Saya tertarik dengan aplikasi SID..."></textarea>
                  </div>
                  <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg">
                    Kirim Pesan Sekarang
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe size={24} className="text-sky-500" />
            <span className="font-heading font-bold text-xl text-white tracking-tight">RUMAH APLIKASI</span>
          </div>
          <p className="mb-6 max-w-md mx-auto">Mitra teknologi terpercaya untuk mewujudkan Smart Village di seluruh pelosok Nusantara.</p>
          <div className="pt-8 border-t border-gray-800 text-sm">
            <p>&copy; {new Date().getFullYear()} Rumah Aplikasi Desa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItemModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-bold text-gray-900 pr-8">{selectedItemModal.title}</h3>
                <button 
                  onClick={() => setSelectedItemModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                {selectedItemModal.image && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <img src={selectedItemModal.image} alt={selectedItemModal.title} className="w-full h-auto max-h-80 object-cover" />
                  </div>
                )}
                
                {selectedItemModal.price && (
                  <div className="mb-4 inline-block bg-sky-50 text-sky-700 px-4 py-2 rounded-xl font-bold text-lg">
                    {selectedItemModal.price}
                  </div>
                )}

                <div className="prose prose-sky max-w-none">
                  {selectedItemModal.detailExplanation ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedItemModal.detailExplanation}
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{selectedItemModal.description}</p>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => handleWhatsAppClick(selectedItemModal.title)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm shadow-green-500/30"
                >
                  <MessageCircle size={20} /> Pesan / Tanya
                </button>
                
                {selectedItemModal.url && (
                  <a 
                    href={selectedItemModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-sm shadow-sky-600/30"
                  >
                    <ExternalLink size={20} /> {selectedItemModal.type ? 'Download / Buka Dokumen' : 'Buka Demo / Link'}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {isLoggedIn && <FiriForms />}
    </div>
  );
}
