
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { BookOpen, ArrowRight, Sparkles, X, Share2, Check } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Siddhanta: The Mathematical Soul of Astrology",
    category: "Siddhanta",
    excerpt: "Discover how ancient Siddhantic calculations align perfectly with modern astronomical data, proving astrology is a precise science of time.",
    content: `Vedic Siddhanta is the rigorous mathematical foundation of astrology, known as 'Ganita Shastra'. For the seeker, it is the 'Cosmic Clock'—a proof that the universe operates with divine precision. For the scholar, it is the study of 'Graha Sphuta' (exact planetary longitudes) and 'Ahargana' (the count of days since the start of Kali Yuga).

The origins of Siddhanta are found in the 'Vedanga Jyotisha', but it reached its zenith with the 'Surya Siddhanta', a text revealed by the Sun God himself to the demon-architect Maya. This text, along with works by Aryabhata, Varahamihira, and Bhaskara, forms the bedrock of celestial mechanics. These ancient masters utilized complex spherical trigonometry and calculus-like methods to calculate planetary orbits, eclipses, and the Earth's circumference with staggering accuracy, long before the invention of the telescope.

One of the most profound concepts in Siddhanta is 'Ahargana'—the calculation of the number of days elapsed since the beginning of the current Kali Yuga (February 18, 3102 BCE). This serves as the 'Zero Point' for all astronomical calculations, allowing for the determination of the 'Madhyama Graha' (mean positions) and subsequently the 'Spashta Graha' (true positions) through complex corrections for eccentricity and velocity.

Siddhanta focuses on 'Drig-Ganita Aikya'—the perfect synchronization between mathematical calculation and visual observation. It teaches us that time is not merely a sequence of events, but a cyclical rhythm governed by immutable laws. The 'Surya Siddhanta' provides detailed methods for calculating the mean and true positions of planets, the occurrence of solar and lunar eclipses, and the phases of the moon. It even accounts for the precession of the equinoxes (Ayanamsha), a concept that modern science only fully understood much later.

Beyond simple calculations, Siddhanta delves into the 'Yuga' cycles—vast stretches of time that define the evolution of consciousness. It explains the 'Mahayuga', consisting of Satya (1.728m years), Treta (1.296m years), Dvapara (864k years), and Kali Yugas (432k years), totaling 4.32 million years. This macro-perspective helps us understand our current position in the cosmic timeline and the specific energetic challenges of our era. We are currently in the early stages of Kali Yuga, a time characterized by spiritual darkness but also by the potential for rapid individual evolution.

The precision of Siddhanta also extends to the calculation of 'Lagna' (Ascendant) and 'Bhava' (Houses). The Earth's rotation, its tilt, and the latitude/longitude of the birth location are factored in to determine the exact degree of the zodiac rising on the eastern horizon at any given moment. This 'Lagna' becomes the anchor for the entire birth chart, defining the physical body and the primary orientation of the soul in this incarnation. Without the mathematical rigor of Siddhanta, the interpretive branches of Samhita and Hora would have no foundation.

Modern astronomical parallels are striking. The 'Surya Siddhanta' calculates the length of the sidereal year as 365.2563627 days, which is incredibly close to the modern value of 365.256363 days. This level of precision, achieved without modern instruments, suggests a deep understanding of the cosmos that transcends mere observation. It points to a meditative or intuitive grasp of the fundamental constants of the universe.

Furthermore, Siddhanta explains the 'Mandaphala' (equation of center) and 'Shighraphala' (equation of conjunction), which are essentially corrections for the elliptical nature of orbits and the relative motion of Earth. These corrections are vital for transforming 'Mean' planetary positions into 'True' positions that match what we see in the sky. It is this 'True' position that carries the actual energetic influence on our lives.

When we calculate a chart at ASTRO LOGIC, we are not guessing; we are solving a celestial equation. Siddhanta provides the 'Bala' (strength) and 'Gati' (motion) of planets, ensuring that every prediction is rooted in the immutable laws of physics and geometry. It is the science of measuring the breath of the universe, connecting the 'Pinda' (microcosm) to the 'Anda' (macrocosm). By understanding the mathematical laws that govern the stars, we gain insight into the laws that govern our own lives, realizing that we are part of a perfectly ordered divine design.

The 'Surya Siddhanta' also describes the 'Bhugola' (Earth-sphere) and the 'Jyotish-Chakra' (Zodiac-circle) in great detail. It explains the concept of 'Deshantara' (longitude correction) and 'Charajya' (ascensional difference), which are essential for adjusting calculations based on the observer's specific location on Earth. This level of geographical awareness is what allows Vedic astrology to be globally applicable, yet locally precise.

In the realm of 'Kala' (Time), Siddhanta defines units as small as a 'Truti' (1/33750th of a second) and as large as a 'Kalpa' (4.32 billion years). This vast temporal scale reminds us of the eternal nature of the soul and the transient nature of our current physical experience. It provides a sense of perspective that is both humbling and empowering, encouraging us to use our limited time on Earth for spiritual growth and 'Dharma'.

The mathematical soul of astrology is not just about numbers; it is about the 'Vibration' of the universe. Each planetary position represents a specific frequency that resonates with our own internal energy centers (Chakras). By understanding the mathematics of the stars, we are essentially learning the music of the spheres, allowing us to harmonize our lives with the celestial symphony. Siddhanta is the sheet music, and our life is the performance. By following the precise notes of the Siddhantic calculations, we can ensure that our performance is in perfect tune with the divine.

This ancient science also details the 'Graha Yuddha' or planetary wars, where two planets occupy the same degree. The winner of this war is determined by complex rules of latitude and brightness, and the outcome significantly impacts the individual's life. It is a testament to the depth of Siddhantic observation that such subtle interactions were documented thousands of years ago.

Finally, Siddhanta teaches us about the 'Ayanamsha'—the difference between the tropical and sidereal zodiacs. This correction is what distinguishes Vedic astrology from its Western counterpart, ensuring that the planetary positions used for analysis are the actual physical positions in the sky. It is this commitment to astronomical truth that makes Siddhanta the unwavering foundation of the entire Vedic system.`,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Samhita: The Collective Karma of Nations",
    category: "Samhita",
    excerpt: "Samhita astrology explains how planetary alignments affect weather, economics, and the collective destiny of societies.",
    content: `Samhita is the branch of 'Mundane Astrology' that deals with collective destiny. To the seeker, it explains why certain eras feel heavy or light for everyone. To the scholar, it is the vast science of 'Medini Jyotish', as detailed in Varahamihira's 'Brihat Samhita', a monumental encyclopedia of ancient wisdom.

This branch explores 'Shakuna Shastra' (the science of omens) and 'Kurma Chakra' (the mapping of planetary influences onto geographical regions). It predicts rainfall, agricultural yields, and 'Artha' (economic) shifts based on planetary transits. When slow-moving giants like Jupiter (Guru) and Saturn (Shani) change signs, they shift the collective psyche of entire nations. For example, the transit of Saturn through Capricorn often signals a period of structural reorganization and economic discipline on a global scale.

The 'Brihat Samhita' covers an incredible range of topics, from the movements of planets to the quality of gems, the characteristics of animals, and even the architectural principles of temples. It teaches us that everything in the physical world is a reflection of a higher celestial order. For instance, the transit of Rahu and Ketu through specific constellations can signal periods of global upheaval, technological breakthroughs, or shifts in the collective ideology.

Samhita also provides deep insights into 'Vayu' (wind) patterns and 'Megha' (cloud) formations, linking them to planetary positions. Ancient sages could predict droughts or floods years in advance by observing the 'Gochara' (transits) of planets like Venus and Mars. This knowledge was vital for the survival and prosperity of ancient civilizations and remains relevant today as we face global environmental challenges. It suggests that the Earth itself is a living organism responding to the celestial environment.

Historically, Samhita has been used to predict the rise and fall of empires. The 'Kurma Chakra' divides the world into nine sections, each ruled by a specific planet and constellation. When a 'Papa Graha' (malefic planet) transits a specific section, that region of the world may experience challenges. Conversely, a 'Subha Graha' (benefic planet) brings prosperity and peace. This macro-mapping allows us to understand the geopolitical shifts that define human history.

Furthermore, Samhita analyzes the 'Rajya' (state) and its leadership. The birth charts of nations (determined by independence dates or founding moments) and their leaders are studied to understand periods of stability, conflict, or prosperity. It emphasizes that the 'Karma' of a leader is deeply intertwined with the 'Karma' of the people they serve. A leader's chart can act as a lightning rod for the collective destiny of the nation, manifesting the results of the people's collective actions.

Samhita also deals with 'Ulkas' (meteors), 'Ketus' (comets), and 'Graha Yuddha' (planetary wars), interpreting these rare events as signals of significant shifts in the world order. It teaches us that we are part of a 'Vishwa' (universal) web. Just as a single drop is moved by the tide, our individual lives are influenced by the 'Samashti Karma' (collective karma) of our society. By studying Samhita, we understand the 'weather' of our times—social, environmental, and political—allowing us to navigate global cycles with foresight and 'Viveka' (discernment).

In the modern context, Samhita can be applied to financial markets. The 'Sarvatobhadra Chakra' is a powerful tool used to predict the prices of commodities and stocks based on planetary transits. It reveals the underlying energetic cycles that drive human greed and fear, which in turn drive the economy. By understanding these cycles, we can make more informed decisions in an increasingly complex world.

Ultimately, Samhita reminds us that our personal journey is inextricably linked to the journey of humanity. It encourages us to look beyond our individual concerns and understand the larger cycles that shape our world. By aligning our actions with the positive collective trends and preparing for the challenging ones, we can contribute to the harmony and evolution of society as a whole. It is the science of being a conscious citizen of the cosmos.

The 'Samhita' also includes the study of 'Vastu' on a city-wide scale, known as 'Nagara Vastu'. It explains how the layout of a city, the placement of its gates, and the flow of its rivers can impact the health and prosperity of its inhabitants. This holistic view of the environment ensures that human settlements are in harmony with the natural and celestial forces.

Another fascinating aspect of Samhita is 'Anga Vidya' or the study of body signs. It teaches that the physical characteristics of a person are a reflection of their 'Karma' and planetary influences. This branch of knowledge was used to identify individuals with great potential or to understand the hidden traits of those in positions of power.

By integrating all these diverse fields of knowledge, Samhita provides a comprehensive framework for understanding the collective experience of life. It teaches us that we are not isolated individuals, but part of a vast, interconnected system that is constantly responding to the rhythms of the stars. Understanding Samhita is the key to living in harmony with the world around us.`,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Hora: Decoding the Blueprint of Your Life",
    category: "Hora",
    excerpt: "The Hora Shastra is the study of individual destiny. Learn how the moment of your birth sets the stage for your life's journey.",
    content: `Hora is 'Jataka Shastra'—the study of individual birth charts. For the seeker, it is the 'Blueprint of the Soul'. For the scholar, it is the intricate analysis of 'Karma Vipaka' (the ripening of past actions) through the 'Dasha-Bhukti' (planetary periods) system. It is the most popular branch of Jyotish, as it speaks directly to the individual's experience, challenges, and potential.

The word 'Hora' comes from 'Ahoratra' (Day and Night), representing the eternal cycle of time. At the moment of your first breath, the heavens freeze into a map called the 'Rasi Chakra'. This map reveals your 'Prarabdha Karma'—the portion of your past actions destined to manifest in this lifetime. It is not a static map, but a dynamic unfolding of energy over time.

The analysis begins with the 'Lagna' (Ascendant), which represents the self, the physical body, and the overall temperament. From there, we examine the twelve 'Bhavas' (houses), each representing a different aspect of life: 1st (Self), 2nd (Wealth/Speech), 3rd (Effort/Siblings), 4th (Home/Mother), 5th (Intelligence/Children), 6th (Obstacles/Health), 7th (Partnerships), 8th (Transformation/Longevity), 9th (Dharma/Father), 10th (Career), 11th (Gains), and 12th (Losses/Liberation). The placement of the nine 'Grahas' (planets) within these houses creates a unique energetic signature for every individual.

One of the most profound aspects of Hora is the 'Vimshottari Dasha' system, a 120-year cycle that determines the timing of events. Each planet takes turns as the primary 'ruler' of a person's life for a specific number of years (e.g., Venus for 20 years, Sun for 6 years). This explains why we go through distinct 'chapters'—a period of intense career focus followed by a period of spiritual seeking, or a time of struggle followed by a time of great abundance.

Scholars utilize 'Varga' (divisional charts) to zoom into specific life areas. The 'Navamsha' (D9) is essential for understanding the strength of planets and the quality of marriage. The 'Dashamsha' (D10) reveals the intricacies of career and professional success. The 'Saptamsha' (D7) focuses on children and creativity, while the 'Shashtiamsha' (D60) provides a deep look into the soul's past life karma. These charts are like a microscope, revealing the hidden layers of the main birth chart.

Hora also analyzes 'Yogas'—specific planetary combinations that produce extraordinary results. A 'Raja Yoga' can indicate power and status, while a 'Dhana Yoga' indicates wealth. Conversely, 'Daridra Yogas' can indicate periods of financial hardship. However, the presence of a Yoga is only half the story; it must be activated by the appropriate Dasha to manifest its results.

The concept of 'Karmic Types' is also central to Hora. 'Sanchita Karma' is the total accumulated karma from all past lives. 'Prarabdha Karma' is the portion of that total that is ready to be experienced in this life. 'Agami Karma' is the new karma we create through our current actions. Hora primarily maps the 'Prarabdha', but it also gives us the tools to manage our 'Agami' karma through conscious choice.

Furthermore, Hora explores the 'Pancha Mahapurusha Yogas'—five types of great personalities formed when Mars, Mercury, Jupiter, Venus, or Saturn are in their own sign or exalted in a Kendra (angular house). These Yogas indicate exceptional talent and potential in specific areas, such as leadership (Mars), communication (Mercury), wisdom (Jupiter), artistry (Venus), or discipline (Saturn).

Hora is not about fatalism; it is about 'Purushartha' (conscious effort). By knowing our strengths and 'Doshas' (afflictions), we can align our 'Sankalpa' (intention) with the divine will. It helps us understand not just what will happen, but why it is happening and how we can grow through it. It is the ultimate tool for self-discovery, helping us navigate the complexities of life with wisdom, grace, and a sense of purpose. By understanding the blueprint of our life, we can become the conscious architects of our destiny.

The study of 'Hora' also includes 'Muhurtha' or the selection of auspicious timing for important life events. By choosing a moment when the planetary energies are most favorable, we can ensure the success and longevity of our endeavors. This is the practical application of Hora in our daily lives, helping us to move in harmony with the celestial flow.

Another key component is 'Ashtakavarga', a system that assigns numerical points to each house based on the positions of the planets. This provides a quantitative measure of the strength and potential of each area of life, allowing for even more precise predictions and analysis. It is a unique feature of Vedic astrology that adds a layer of mathematical certainty to the interpretive process.

By mastering the science of Hora, we gain a profound understanding of our own nature and our place in the universe. It is a journey of self-realization that reveals the divine order behind the apparent chaos of life. Through the lens of Hora, we see that every challenge is an opportunity for growth and every success is a reflection of our own inner alignment. It is the ultimate guide to living a life of purpose, fulfillment, and spiritual evolution.`,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "The Science of Doshas: Energetic Imbalances",
    category: "Science",
    excerpt: "Doshas are not curses; they are energetic imbalances. Learn the science behind why certain planetary positions cause friction.",
    content: `In Vedic science, a 'Dosha' is not a curse but an 'Arishta'—a flaw or imbalance in the energetic circuit of the soul. To the seeker, it's like a 'kink in the hose' of life's energy. To the scholar, it is an imbalance of the 'Pancha Mahabhutas' (five elements: Earth, Water, Fire, Air, Ether) caused by planetary placements at the time of birth.

For example, 'Mangala Dosha' (Mars affliction) is an excess of 'Tejas' (fire) in the houses of relationship. If not grounded, it can cause friction, impulsivity, and conflict in 'Kutumba' (family) life. 'Kaala Sarpa' represents a life hemmed in by the nodes Rahu and Ketu, where all planets are on one side of the nodal axis, requiring intense 'Tapasya' (discipline) to break through perceived limitations. These are diagnostic tools, identifying where our 'Karmic Debt' lies and where we need to apply conscious effort.

Understanding Doshas requires a deep look at the 'Gunas' (qualities)—Sattva (purity/balance), Rajas (activity/passion), and Tamas (inertia/darkness). A planet in a difficult position might be expressing its more Tamasic or Rajasic qualities. The goal of Vedic remedies is to shift that energy toward Sattva. This is achieved through specific actions that resonate with the planet's higher frequency, such as meditation, ethical living, and specific rituals.

Doshas can also manifest in the physical body, as explained in Ayurveda, the sister science of Jyotish. A 'Pitta' imbalance in the body often corresponds to a strong or afflicted Mars in the birth chart. A 'Vata' imbalance might link to an afflicted Saturn or Rahu. By addressing the imbalance through both astrological remedies and Ayurvedic practices (diet, herbs, lifestyle), we can achieve holistic healing—balancing the mind, body, and soul simultaneously.

The concept of 'Karmic Debt' is central to understanding Doshas. They represent areas where we have misused energy in the past and are now required to learn balance. For instance, a 'Shani Dosha' (Saturn affliction) might indicate a need to learn patience, discipline, and humility. Instead of fearing these placements, we can view them as 'Sacred Assignments' or 'Soul Lessons' that lead to profound evolution. They are the friction that creates the heat required for spiritual transformation.

Practical application of Dosha knowledge involves 'Upayas' or remedies. For 'Mangala Dosha', one might be advised to practice 'Kshama' (forgiveness) and engage in physical activities that channel the excess fire constructively. For 'Rahu-Ketu' related Doshas, spiritual practices like 'Mantra Japa' and 'Seva' are highly effective. The key is to understand that the planet is not 'bad'; its energy is simply being expressed in a way that causes friction in our current state of consciousness.

Modern psychology often mirrors these ancient concepts. What we call a 'Dosha' might be seen as a 'Shadow' or a 'Complex' in Jungian terms—a part of our psyche that is unintegrated and causing repetitive patterns of behavior. By bringing awareness to these patterns, we can begin the process of integration and healing. Vedic astrology provides a celestial map of these psychological structures, allowing for a more targeted approach to personal growth.

The remedy is 'Shanti'—peace-making through 'Upayas'. These include 'Mantra' (sound vibration therapy), 'Dana' (charity to specific causes), and 'Yagya' (sacred fire rituals) designed to re-tune our frequency. Gemstone therapy is also used to strengthen weak but beneficial planets. However, the most powerful remedy is always 'Viveka' (discernment) and 'Sankalpa' (conscious intention) to change our behavior.

Understanding your Dosha is the first step toward 'Atmabodha' (self-realization). It allows you to stop blaming external circumstances and start taking responsibility for your energetic state. By working consciously with these imbalances, we transform friction into light, achieving balance and harmony in all areas of life. It is the process of turning our 'weaknesses' into our greatest spiritual assets.

The study of Doshas also involves 'Parihara' or the neutralization of negative influences. This is a highly specialized field that requires a deep understanding of the specific planetary combinations and their corresponding remedies. It is not a one-size-fits-all approach, but a personalized plan for energetic realignment.

By addressing our Doshas, we are not just fixing problems; we are clearing the path for our highest potential to manifest. It is the process of removing the obstacles that prevent us from living a life of 'Dharma', 'Artha', 'Kama', and 'Moksha'. It is the ultimate act of self-care and spiritual responsibility.`,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The Mystery of Retrograde Planets: A Deep Dive",
    category: "Siddhanta",
    excerpt: "Why planets seem to move backward and how it affects our psychological state and decision-making.",
    content: `'Vakri' or retrograde motion is a profound celestial phenomenon that has fascinated astrologers for millennia. To the seeker, it is a 'Second Chance'—a time to go back and fix what was missed. To the scholar, it is the manifestation of 'Chesta Bala'—the planetary strength gained through intense effort, repetition, and 'retrospection'.

Astronomically, retrograde motion is an optical illusion caused by the relative speeds of Earth and other planets in their orbits. When Earth passes a slower-moving outer planet (like Mars, Jupiter, or Saturn), or when a faster-moving inner planet (like Mercury or Venus) passes Earth, the planet appears to move backward against the backdrop of the stars. However, in Jyotish, this illusion has a very real psychological and karmic impact.

When a planet is 'Vakri', its energy turns 'Antarmukhi' (inward). It is not a time for outward expansion but for 'Manana' (deep reflection). A retrograde Mercury (Budha) invites us to review our 'Buddhi' (intellect), communication, and decision-making processes. A retrograde Jupiter (Guru) demands a re-evaluation of our 'Dharma' (righteousness), beliefs, and long-term goals. The energy is not 'less', but 'different'—it is more intense and internalized.

Retrograde planets are often considered more powerful because they are physically closer to the Earth during their retrograde phase. This 'Chesta Bala' (motional strength) means their influence is felt more intensely in the individual's psyche. If a retrograde planet is a 'Subha' (benefic), it can bring unexpected gains, deep spiritual insights, and the ability to see things others miss. If it is a 'Papa' (malefic), it can bring intense internal challenges, delays, and a feeling of being 'stuck' until the underlying lesson is learned.

In the context of 'Sanchita Karma', retrograde planets represent unresolved issues or 'unfinished business' from past incarnations. They are like 'bookmarks' in the soul's journey, indicating specific areas where we need to pause, repeat lessons, and integrate wisdom before moving forward. For example, a retrograde Venus might indicate a need to re-evaluate our approach to relationships, resolving patterns of attachment or value that have persisted across lifetimes.

During a retrograde transit, the external world may seem to slow down or become confusing. Projects may face delays, and communication may break down. However, these are not 'bad' events; they are the universe's way of forcing us to slow down and check our work. It is a time for 'Svadhyaya' (self-study) and refining our internal processes. It ensures that we do not move forward on a shaky foundation.

Practical advice for retrograde periods includes 'Re-doing' rather than 'New-doing'. It is a time for 'Reviewing', 'Refining', 'Repairing', and 'Reconnecting'. If Mercury is retrograde, double-check your emails and travel plans. If Venus is retrograde, revisit old creative projects or reconnect with old friends. If Mars is retrograde, be mindful of suppressed anger and avoid starting new conflicts. By working with the inward flow of energy, we avoid the frustration of trying to push against the celestial tide.

In the 'Siddhantic' view, these periods are essential for the soul's 'Shuddhi' (purification). By embracing the 'Vakri' periods, we can transform confusion into clarity. We learn to use the intense, internalized energy of these planets for profound self-transformation. It is the universe's way of perfecting our path, giving us the opportunity to resolve deep-seated issues and emerge with a more refined and authentic expression of our true self.

The study of retrograde planets also involves understanding 'Vakri-Gati' in the context of the 'Dashas'. A retrograde planet in its own Dasha can bring about significant internal shifts and a re-evaluation of the soul's purpose. It is a time of deep 'Sadhana' (spiritual practice) and self-discovery.

By working with the retrograde energy, we are not just surviving the transit; we are thriving in it. We are using the inward flow of energy to refine our internal processes and emerge with a more authentic and powerful expression of our true self. It is the ultimate act of self-mastery and spiritual evolution.`,
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46abb4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Sade Sati: The Seven Year Transformation",
    category: "Hora",
    excerpt: "A deep dive into Saturn's transit and why it's a period of profound growth, not just fear and challenges.",
    content: `'Sade Sati' is perhaps the most talked-about and feared transit in Vedic astrology. It refers to the 7.5-year period when Saturn (Shani) transits through the sign preceding the natal Moon, the sign of the natal Moon itself, and the sign following it. To the seeker, it is the 'Great Teacher'—a period of discipline, maturity, and reality-testing. To the scholar, it is 'Shani Gochara' through the 12th, 1st, and 2nd houses from the 'Janma Rasi'.

Saturn is the 'Karaka' (significator) of Karma, Time, and Discipline. During Sade Sati, he acts as a 'Mahakala', stripping away 'Maya' (illusion) and forcing us to face 'Satya' (truth). It is a period of 'Vairagya' (detachment), where we learn that true security comes from within, not from external 'Artha' (wealth), 'Kama' (desire), or social status. Saturn's goal is not to punish, but to 'Refine' the soul, like gold being purified in a furnace.

The transit is divided into three distinct phases of 2.5 years each. The first phase (12th house from Moon) often brings mental pressure, hidden worries, and changes in the home or family environment. The second phase (1st house/over the Moon) is the peak of the transformation, often involving significant life challenges, health issues, or career shifts that demand extreme resilience and hard work. The third phase (2nd house from Moon) focuses on financial stability, family responsibilities, and the integration of the lessons learned.

Saturn's influence during Sade Sati forces us to take responsibility for our past actions (Karma). It is a time of 'Accountability'. Those who have lived with integrity, 'Dharma', and discipline often find that Sade Sati brings the rewards of their long-term efforts—promotions, stable relationships, and deep wisdom. For others, it can be a time of 'loss' as Saturn removes everything that is no longer serving the soul's growth.

Practical remedies for Sade Sati are not about 'escaping' the transit, but about aligning with Saturn's energy. This involves 'Seva' (selfless service), 'Dana' (charity to the elderly, disabled, or less fortunate), and practicing 'Satya' (truthfulness). Reciting the 'Shani Chalisa', the 'Mahamrityunjaya Mantra', or the 'Hanuman Chalisa' can provide the mental strength and protection needed to navigate the challenges. A lifestyle of simplicity, discipline, and humility is the best way to please Saturn.

One of the most effective ways to handle Sade Sati is to embrace 'Hard Work' and 'Responsibility'. Instead of resisting the pressure, use it to build something lasting. Saturn respects effort and endurance. It is also a time to simplify your life, removing unnecessary distractions and focusing on what truly matters. This 'Vairagya' (detachment) is the key to inner peace during this intense period.

The three cycles of Sade Sati in a typical human life represent different stages of 'Purification'. The first (in childhood/youth) builds character; the second (in middle age) brings maturity and professional peak; the third (in old age) prepares the soul for spiritual liberation. While it can bring 'Kashta' (hardship), its ultimate goal is 'Siddhi' (perfection).

Those who embrace the lessons of 'Dharma' and 'Satya' during this time emerge with unshakable resilience and a clear sense of purpose. It is not a period to be feared, but a 'Sacred Graduation' that prepares the soul for its highest destiny. By surrendering to the discipline of Shani, we find a strength we never knew we possessed, turning a period of intense challenge into a lifetime of profound wisdom and inner peace.

The study of Sade Sati also involves understanding the 'Shani-Ashtakavarga' points. If the natal sign has high points, the transit will be much easier to handle. This adds a layer of personalization to the analysis, explaining why some people sail through Sade Sati while others face intense challenges.

By working with the energy of Shani, we are not just surviving the transit; we are thriving in it. We are using the pressure to build a solid foundation for our future and emerge with a more authentic and powerful expression of our true self. It is the ultimate act of self-mastery and spiritual evolution.`,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "The Power of Nakshatras: Beyond the Sun Signs",
    category: "Hora",
    excerpt: "Discover the 27 Lunar Mansions and how they provide a much deeper layer of personality and destiny analysis.",
    content: `While most people are familiar with the 12 Rasis (Zodiac signs), the true depth and precision of Vedic astrology lie in the 27 'Nakshatras' or Lunar Mansions. To the seeker, these are the 'Cosmic Personalities' that color our emotions and subconscious drives. To the scholar, they are the 13°20' divisions of the ecliptic that provide the most granular level of prediction and character analysis.

Each Nakshatra is ruled by a specific deity and a planet, and possesses its own unique 'Shakti' (power). For example, 'Ashwini' (the first Nakshatra) is ruled by the Ashwini Kumaras, the celestial physicians, and has the power to heal and bring quick results. 'Bharani' is ruled by Yama, the god of death, and represents the power to take away, transform, and give birth to something new. Understanding your 'Janma Nakshatra' (the one the Moon was in at birth) is crucial for understanding your mental, emotional, and psychological makeup.

The Nakshatras are further divided into four 'Padas' (quarters) of 3°20' each. Each Pada corresponds to one of the four 'Purusharthas' (goals of life): Dharma (duty), Artha (wealth), Kama (desire), and Moksha (liberation). This level of detail allows an astrologer to pinpoint specific life events and character traits with uncanny accuracy. For instance, a planet in the 4th Pada of a Nakshatra will have a more spiritual or 'Moksha' oriented expression.

Furthermore, Nakshatras are classified into different 'Ganas'—Deva (divine/harmonious), Manushya (human/mixed), and Rakshasa (demonic/intense). These classifications help in understanding a person's temperament and their compatibility with others. For instance, two people with 'Deva Gana' Nakshatras often find it easier to harmonize their values, while a 'Deva' and 'Rakshasa' pairing may face significant friction unless they work consciously on their differences.

The 'Yoni' classification of Nakshatras, based on animal symbols (e.g., Horse, Elephant, Serpent), provides deep insights into a person's instinctive nature, biological drives, and physical compatibility. This is a key component of 'Ashta Kuta' matching for marriage, revealing the deep-seated psychological and physical forces that influence our relationships. It explains why we feel an immediate 'click' or 'clash' with certain individuals.

Practical application of Nakshatra knowledge includes 'Nakshatra-based Remedies'. Each Nakshatra has a specific tree, animal, and bird associated with it. Planting and caring for your 'Janma Nakshatra' tree is a powerful way to harmonize your energy. Similarly, honoring the deity of your Nakshatra through specific mantras can bring profound mental peace and clarity.

The Nakshatra system also powers the 'Vimshottari Dasha', the most reliable predictive tool in Jyotish. The starting point of your life's planetary cycles is determined by the exact degree of the Moon within its Nakshatra at birth. This ensures that the timing of your life's events is perfectly tailored to your unique soul blueprint.

By studying the Nakshatras, we move beyond the broad strokes of Sun signs and into the intricate tapestry of our individual soul. We learn that we are not just a 'Leo' or a 'Scorpio', but a unique blend of celestial energies that have been refined over countless lifetimes. Each Nakshatra is a gateway to a deeper understanding of our 'Svadharma' (personal duty) and our unique contribution to the cosmic order. It is a journey from the general to the specific, from the surface to the core of our being, revealing the divine complexity of the human experience.

The study of Nakshatras also involves understanding the 'Nadi' classification, which relates to the flow of energy in the body. This is a crucial factor in determining health and compatibility, ensuring that the energetic systems of two individuals are in harmony.

By mastering the science of Nakshatras, we gain a profound understanding of our own nature and our place in the universe. It is a journey of self-realization that reveals the divine order behind the apparent chaos of life. Through the lens of Nakshatras, we see that every challenge is an opportunity for growth and every success is a reflection of our own inner alignment. It is the ultimate guide to living a life of purpose, fulfillment, and spiritual evolution.`,
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Vastu Shastra: Aligning Your Space with the Stars",
    category: "Samhita",
    excerpt: "Learn how the principles of Vastu Shastra can harmonize your living environment with celestial energies for health and prosperity.",
    content: `Vastu Shastra is the 'Science of Architecture' and is considered a sister science to Jyotish. To the seeker, it is about 'Home Harmony' and creating a sanctuary. To the scholar, it is the application of 'Sthapatya Veda'—the knowledge of how physical structures interact with the 'Prana' (life force) of the universe and the magnetic/solar energies of the Earth.

The core principle of Vastu is the 'Vastu Purusha Mandala', a sacred grid that represents the cosmic man (Purusha) pinned to the Earth. By aligning our homes and workplaces with this grid, we ensure that the energies of the eight directions (Dikpalas) and the five elements (Pancha Mahabhutas: Earth, Water, Fire, Air, Ether) are in balance. Each direction is ruled by a specific deity and a planet, influencing different aspects of our lives.

For instance, the Northeast (Ishanya) is the zone of Water and spiritual growth, ruled by Jupiter. It should be kept light, clean, and open. The Southeast (Agneya) is the zone of Fire and vitality, ruled by Venus, making it the ideal location for a kitchen. The Southwest (Nairutya) is the zone of Earth and stability, ruled by Rahu, making it the best place for the master bedroom or heavy storage.

Vastu is not just about moving furniture; it's about understanding the flow of 'Prana'. A blocked entrance, a misplaced toilet, or a cluttered center (Brahmasthan) can create 'Vastu Doshas' that manifest as health issues, financial stress, relationship friction, or mental lethargy. Remedies often involve simple adjustments like changing colors, adding specific plants, using mirrors to expand space, or placing specific symbols/yantras to re-route the energy flow.

Practical Vastu tips for modern living include keeping the center of the house (Brahmasthan) free of heavy objects and clutter to allow energy to circulate. Ensuring that your head points South or East while sleeping promotes better rest and health. Placing a small water feature in the Northeast can enhance spiritual growth and mental clarity. These small changes can have a significant impact on the 'vibe' of your space.

The orientation of a building is of primary importance. A north-facing or east-facing entrance is generally considered most auspicious as it allows the positive 'Prana' from the magnetic north and the rising sun to enter the space. This 'Solar' and 'Magnetic' alignment supports the health and prosperity of the inhabitants. Vastu also emphasizes the use of natural materials (wood, stone, clay) and the importance of light and ventilation to maintain a high-vibrational environment.

There is a deep connection between Vastu and the individual's birth chart. A person with a weak Mars might find that their home has a Vastu defect in the Southeast (the fire zone). By correcting the Vastu of the home, they can actually strengthen the corresponding planetary energy in their own life. It is a form of 'Environmental Upaya' (remedy).

When our environment is in sync with the celestial order, our individual 'Karma' can manifest more smoothly. Vastu provides the 'Sthana Bala' (strength of place) that supports our 'Purushartha' (efforts). It is the art of creating a 'Temple for the Soul', where we can live in resonance with the divine rhythms of the universe. By aligning our outer space with our inner stars, we create a powerful foundation for a life of 'Ananda' (bliss), 'Abhyudaya' (prosperity), and spiritual evolution. It is the science of living in harmony with the Earth and the Stars simultaneously.

The study of Vastu also involves understanding the 'Ayadi' calculations, which are used to determine the dimensions of a building that are in harmony with the owner's birth chart. This ensures that the structure itself becomes a source of positive energy and support for the inhabitants.

By mastering the science of Vastu, we gain a profound understanding of the relationship between our environment and our own well-being. It is a journey of self-realization that reveals the divine order behind the apparent chaos of the physical world. Through the lens of Vastu, we see that every space is a reflection of our own inner state and an opportunity for growth and transformation. It is the ultimate guide to living in harmony with the world around us.`,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
  }
];

const BlogSection = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [selectedPost, setSelectedPost] = React.useState<typeof BLOG_POSTS[0] | null>(null);
  const [isShared, setIsShared] = React.useState(false);

  const handleShare = async (post: typeof BLOG_POSTS[0]) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${post.title}\n\n${post.excerpt}\n\nRead more at: ${window.location.href}`);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] mb-4 shadow-lg border border-[#D4AF37]/20">
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl sm:text-5xl font-black text-[#D4AF37] uppercase tracking-widest astrological-font mb-2">
          {lang === 'kn' ? 'ಜ್ಞಾನ ಭಂಡಾರ' : lang === 'tcy' ? 'ಜ್ಞಾನದ ಬಂಡಾರ' : 'Celestial Wisdom Blog'}
        </h2>
        <p className="text-sm sm:text-lg font-medium text-white/70 uppercase tracking-[0.2em]">
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
              className="relative w-[90vw] max-w-6xl bg-[#fffbeb] rounded-[3rem] border-4 border-[#D4AF37] shadow-[0_0_100px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="h-64 sm:h-80 relative shrink-0">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#451a03] to-transparent" />
                <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                  <button 
                    onClick={() => handleShare(selectedPost)}
                    className="p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    {isShared ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
                    <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
                      {isShared ? 'Copied' : 'Share'}
                    </span>
                  </button>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
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
                  {selectedPost.content.split('\n\n').map((paragraph, pIdx) => (
                    <p 
                      key={pIdx}
                      className={`text-xl sm:text-3xl font-serif text-[#451a03] leading-[1.8] sm:leading-[2] mb-8 ${
                        pIdx === 0 ? 'first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#D4AF37] drop-shadow-sm' : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
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
