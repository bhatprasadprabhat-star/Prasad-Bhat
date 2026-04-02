
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { BookOpen, ArrowRight, Sparkles, X } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Siddhanta: The Mathematical Soul of Astrology",
    category: "Siddhanta",
    excerpt: "Discover how ancient Siddhantic calculations align perfectly with modern astronomical data, proving astrology is a precise science of time.",
    content: `Vedic Siddhanta is the rigorous mathematical foundation of astrology, known as 'Ganita Shastra'. For the seeker, it is the 'Cosmic Clock'—a proof that the universe operates with divine precision. For the scholar, it is the study of 'Graha Sphuta' (exact planetary longitudes) and 'Ahargana' (the count of days since the start of Kali Yuga).

Ancient masters like Aryabhata and Bhaskara utilized complex spherical trigonometry to calculate planetary orbits and eclipses with staggering accuracy. This branch focuses on 'Drig-Ganita Aikya'—the perfect synchronization between mathematical calculation and visual observation. It teaches us that time is not merely a sequence of events, but a cyclical rhythm governed by the 'Surya Siddhanta' and other canonical texts.

When we calculate a chart, we are not guessing; we are solving a celestial equation. Siddhanta provides the 'Bala' (strength) and 'Gati' (motion) of planets, ensuring that every prediction is rooted in the immutable laws of physics and geometry. It is the science of measuring the breath of the universe, connecting the 'Pinda' (microcosm) to the 'Anda' (macrocosm).`,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Samhita: The Collective Karma of Nations",
    category: "Samhita",
    excerpt: "Samhita astrology explains how planetary alignments affect weather, economics, and the collective destiny of societies.",
    content: `Samhita is the branch of 'Mundane Astrology' that deals with collective destiny. To the seeker, it explains why certain eras feel heavy or light for everyone. To the scholar, it is the vast science of 'Medini Jyotish', as detailed in Varahamihira's 'Brihat Samhita'.

This branch explores 'Shakuna Shastra' (the science of omens) and 'Kurma Chakra' (the mapping of planetary influences onto geographical regions). It predicts rainfall, agricultural yields, and 'Artha' (economic) shifts based on planetary transits. When slow-moving giants like Jupiter (Guru) and Saturn (Shani) change signs, they shift the collective psyche of entire nations.

Samhita teaches us that we are part of a 'Vishwa' (universal) web. Just as a single drop is moved by the tide, our individual lives are influenced by the 'Samashti Karma' (collective karma) of our society. By studying Samhita, we understand the 'weather' of our times—social, environmental, and political—allowing us to navigate global cycles with foresight and 'Viveka' (discernment).`,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Hora: Decoding the Blueprint of Your Life",
    category: "Hora",
    excerpt: "The Hora Shastra is the study of individual destiny. Learn how the moment of your birth sets the stage for your life's journey.",
    content: `Hora is 'Jataka Shastra'—the study of individual birth charts. For the seeker, it is the 'Blueprint of the Soul'. For the scholar, it is the intricate analysis of 'Karma Vipaka' (the ripening of past actions) through the 'Dasha-Bhukti' (planetary periods) system.

The word 'Hora' comes from 'Ahoratra' (Day and Night), representing the eternal cycle of time. At the moment of your first breath, the heavens freeze into a map called the 'Rasi Chakra'. This map reveals your 'Prarabdha Karma'—the portion of your past actions destined to manifest in this lifetime.

Scholars utilize 'Varga' (divisional charts) like the 'Navamsha' (D9) for marriage and 'Dashamsha' (D10) for career to zoom into specific life areas. Hora is not about fatalism; it is about 'Purushartha' (conscious effort). By knowing our strengths and 'Doshas' (afflictions), we can align our 'Sankalpa' (intention) with the divine will, turning the map of our life into a path of 'Moksha' (liberation).`,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The Science of Doshas: Energetic Imbalances",
    category: "Science",
    excerpt: "Doshas are not curses; they are energetic imbalances. Learn the science behind why certain planetary positions cause friction.",
    content: `In Vedic science, a 'Dosha' is not a curse but an 'Arishta'—a flaw or imbalance in the energetic circuit. To the seeker, it's like a 'kink in the hose' of life's energy. To the scholar, it is an imbalance of the 'Pancha Mahabhutas' (five elements) caused by planetary placements.

For example, 'Mangala Dosha' is an excess of 'Tejas' (fire) that can cause friction in 'Kutumba' (family) life if not grounded. 'Kaala Sarpa' represents a life hemmed in by the nodes Rahu and Ketu, requiring intense 'Tapasya' (discipline) to break through. These are diagnostic tools, identifying where our 'Karmic Debt' lies.

The remedy is 'Shanti'—peace-making through 'Upayas'. These include 'Mantra' (sound vibration), 'Dana' (charity), and 'Yagya' (sacred fire rituals) designed to re-tune our frequency. Understanding your Dosha is the first step toward 'Atmabodha' (self-realization), allowing you to transform friction into the heat required for spiritual evolution.`,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The Mystery of Retrograde Planets: A Deep Dive",
    category: "Siddhanta",
    excerpt: "Why planets seem to move backward and how it affects our psychological state and decision-making.",
    content: `'Vakri' or retrograde motion is a profound celestial phenomenon. To the seeker, it is a 'Second Chance'—a time to go back and fix what was missed. To the scholar, it is the manifestation of 'Chesta Bala'—the planetary strength gained through intense effort and 'retrospection'.

When a planet is 'Vakri', its energy turns 'Antarmukhi' (inward). It is not a time for outward expansion but for 'Manana' (deep reflection). A retrograde Mercury (Budha) invites us to review our 'Buddhi' (intellect), while a retrograde Jupiter (Guru) demands a re-evaluation of our 'Dharma' (righteousness).

Retrograde planets often signify 'Sanchita Karma'—accumulated actions from past lives that demand our attention now. They force us to slow down, repeat lessons, and integrate wisdom. In the 'Siddhantic' view, these periods are essential for the soul's 'Shuddhi' (purification), ensuring that we do not move forward on a shaky foundation. It is the universe's way of perfecting our path.`,
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46abb4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Sade Sati: The Seven Year Transformation",
    category: "Hora",
    excerpt: "A deep dive into Saturn's transit and why it's a period of profound growth, not just fear and challenges.",
    content: `'Sade Sati' is the 7.5-year transit of Saturn (Shani) over the natal Moon's vicinity. To the seeker, it is the 'Great Teacher'—a period of discipline and maturity. To the scholar, it is 'Shani Gochara' through the 12th, 1st, and 2nd houses from the 'Janma Rasi'.

Saturn is the 'Karaka' (significator) of Karma and Time. During Sade Sati, he acts as a 'Mahakala', stripping away 'Maya' (illusion) and forcing us to face 'Satya' (truth). It is a period of 'Vairagya' (detachment), where we learn that true security comes from within, not from external 'Artha' (wealth) or 'Kama' (desire).

The three cycles of Sade Sati represent different stages of 'Purification'. While it can bring 'Kashta' (hardship), its ultimate goal is 'Siddhi' (perfection). Those who embrace 'Dharma' and 'Satya' during this time emerge with unshakable resilience. It is not a period to be feared, but a 'Sacred Graduation' that prepares the soul for its highest destiny.`,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop"
  }
];

const BlogSection = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [selectedPost, setSelectedPost] = React.useState<typeof BLOG_POSTS[0] | null>(null);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 shadow-lg border border-[#D4AF37]/20">
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl sm:text-5xl font-black text-[#451a03] uppercase tracking-widest astrological-font mb-2">
          {lang === 'kn' ? 'ಜ್ಞಾನ ಭಂಡಾರ' : lang === 'tcy' ? 'ಜ್ಞಾನದ ಬಂಡಾರ' : 'Celestial Wisdom Blog'}
        </h2>
        <p className="text-sm sm:text-lg font-medium text-[#7c2d12] opacity-70 uppercase tracking-[0.2em]">
          Exploring Siddhanta, Samhita, and Hora
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border-2 border-[#D4AF37]/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all group flex flex-col cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#451a03] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {post.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-[#451a03] mb-3 leading-tight group-hover:text-[#D4AF37] transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-[#451a03]/70 font-medium leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <button className="flex items-center gap-2 text-[#D4AF37] font-black uppercase text-[10px] tracking-widest group/btn">
                Read Full Article 
                <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#fffbeb] rounded-[3rem] border-4 border-[#D4AF37] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-64 sm:h-80 relative shrink-0">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#451a03] to-transparent" />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all z-10"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-[#D4AF37] text-[#451a03] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg inline-block mb-4">
                    {selectedPost.category}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>
              <div className="p-8 sm:p-16 overflow-y-auto flex-1 custom-scrollbar">
                <div className="prose prose-amber max-w-none">
                  <p className="text-xl sm:text-3xl font-serif text-[#451a03] leading-[1.8] sm:leading-[2] first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#D4AF37] drop-shadow-sm">
                    {selectedPost.content}
                  </p>
                  <div className="mt-16 pt-12 border-t-2 border-[#D4AF37]/20 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shadow-inner">
                      <Sparkles size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#7C2D12] uppercase tracking-[0.4em]">Astro Logic Editorial</p>
                      <p className="text-sm font-medium text-[#451a03]/60 italic">Ancient Wisdom for the Modern Soul</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-16 p-8 sm:p-12 bg-gradient-to-br from-[#451a03] to-[#7c2d12] rounded-[3rem] text-center relative overflow-hidden shadow-2xl border-4 border-[#D4AF37]/30">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={120} className="text-[#D4AF37]" />
        </div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl sm:text-4xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font">
            Deepen Your Understanding
          </h3>
          <p className="text-sm sm:text-lg text-white/80 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Astrology is a language. If you understand this language, the sky speaks to you."
          </p>
          <div className="pt-4">
            <button className="px-10 py-4 bg-[#D4AF37] text-[#451a03] rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">
              View All Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
