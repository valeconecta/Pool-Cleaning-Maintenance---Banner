import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { CheckCircle2, LayoutGrid, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import ImageCarousel from '../components/ImageCarousel';
import LightboxModal from '../components/LightboxModal';

interface ServiceDetailProps {
  title: string;
  subtitle: string;
  description: string;
  included: string[];
  forWho: string[];
  whyUs: string;
  gallery?: string[];
}

export default function ServiceDetail({ title, subtitle, description, included, forWho, whyUs, gallery }: ServiceDetailProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; initialIndex: number }>({
    isOpen: false,
    initialIndex: 0,
  });

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center py-24 text-white overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/150S7JPsn4A_JDsm3SpAXFZcStANSOKsh" 
            className="w-full h-full object-cover"
            alt={title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,105.34,121.53,108.55,172,95.83,222.5,83.1,263.4,67.23,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg">
                  {description}
                </p>
                <Link to="/contact" className="btn-primary inline-block">
                  {t('cta_estimate')}
                </Link>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-brand-dark">{t('service_included')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {included.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-slate-600">
                      <CheckCircle2 className="text-brand-light shrink-0" size={20} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {gallery && gallery.length > 0 && (
                <div className="space-y-8 pt-8 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-3xl font-bold text-brand-dark">{t('service_gallery')}</h2>
                    
                    {/* View Controls */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto border border-slate-200">
                      <button
                        onClick={() => setViewMode('carousel')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          viewMode === 'carousel'
                            ? 'bg-white text-brand-dark shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        id="view-mode-carousel-toggle"
                      >
                        <Sliders size={14} />
                        <span>{t('view_mode_carousel')}</span>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          viewMode === 'grid'
                            ? 'bg-white text-brand-dark shadow-sm'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        id="view-mode-grid-toggle"
                      >
                        <LayoutGrid size={14} />
                        <span>{t('view_mode_grid')}</span>
                      </button>
                    </div>
                  </div>

                  {viewMode === 'carousel' ? (
                    <div className="max-w-3xl mx-auto">
                      <ImageCarousel 
                        images={gallery} 
                        alt={title}
                        onImageClick={(index) => setLightbox({ isOpen: true, initialIndex: index })}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {gallery.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setLightbox({ isOpen: true, initialIndex: idx })}
                          className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl group cursor-pointer relative"
                        >
                          <img 
                            src={img} 
                            alt={`${title} gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-brand-dark/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-md text-brand-dark font-medium text-xs px-3 py-1.5 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                              {t('cta_view_details')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Lightbox Modal for gallery viewing */}
                  <LightboxModal
                    isOpen={lightbox.isOpen}
                    onClose={() => setLightbox({ ...lightbox, isOpen: false })}
                    images={gallery}
                    initialIndex={lightbox.initialIndex}
                    title={title}
                  />
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-bold text-brand-dark">{t('service_for_who')}</h3>
                <ul className="space-y-3">
                  {forWho.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-light mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-dark p-8 rounded-3xl text-white space-y-4">
                <h3 className="text-xl font-bold">{t('service_why_us')}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {whyUs}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
