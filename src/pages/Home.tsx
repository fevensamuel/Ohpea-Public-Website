import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, CalendarDays, MapPin } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useStats } from '../hooks/useStats.js';
import { StatCounter } from '../components/StatCounter.js';
import { ProgramCard } from '../components/ProgramCard.js';
import { EventCard } from '../components/EventCard.js';
import { PartnerGrid } from '../components/PartnerGrid.js';
import { CountdownTimer } from '../components/CountdownTimer.js';
import { AnnouncementCard } from '../components/AnnouncementCard.js';
import { fallbackAnnouncements, fallbackPartners, fallbackActivities } from '../data/fallbackContent.js';
import { api } from '../lib/ophea-api-client.js';
import { localize } from '../utils/localize.js';
import heroLandscape from '../assets/hero-landscape.jpg';
import introPatio from '../assets/intro-patio.jpg';
import introHospitality from '../assets/intro-hospitality.jpg';
import trainingPhoto from '../assets/activity-training.jpg';
import destinationPhoto from '../assets/activity-destination.jpg';
import hospitalityPhoto from '../assets/activity-hospitality.jpg';
import memberPortrait from '../assets/member-portrait.jpg';

const activityImages = [trainingPhoto, destinationPhoto, hospitalityPhoto];

export const Home: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { stats } = useStats();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [announcements, setAnnouncements] = useState<any[]>(fallbackAnnouncements);
  const [partners, setPartners] = useState<any[]>(fallbackPartners);
  const [activities, setActivities] = useState<any[]>(fallbackActivities);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    api.getPrograms().then((data) => {
      if (mounted && Array.isArray(data)) setPrograms(data);
    }).catch(() => {});
    api.getAnnouncements({ limit: 12 }).then((res) => {
      if (mounted && res?.data?.length) setAnnouncements(res.data);
    }).catch(() => {});
    api.getPartners().then((data) => {
      if (mounted && data?.length) setPartners(data);
    }).catch(() => {});
    api.getActivities().then((data) => {
      if (mounted && data?.length) setActivities(data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const [announcementTab, setAnnouncementTab] = useState<'all' | 'vacancy' | 'call_for_proposal' | 'call_for_research'>('all');
  const [eventTab, setEventTab] = useState<'upcoming' | 'past'>('upcoming');
  const newsItems = announcements.filter((a) => a.type === 'news');
  const featuredEvent = announcements.find((a) => a.type === 'event' && a.featured) || announcements.find((a) => a.type === 'event');
  const filteredAnnouncements = announcements.filter((a) => {
    if (a.type === 'news' || a.type === 'event') return false;
    if (announcementTab === 'all') return true;
    return a.type === announcementTab ||
      (announcementTab === 'call_for_proposal' && a.type === 'proposal') ||
      (announcementTab === 'call_for_research' && a.type === 'research');
  });
  const eventItems = announcements.filter((a) => {
    if (a.type !== 'event') return false;
    const isPast = a.eventStartAt ? new Date(a.eventStartAt).getTime() < Date.now() : false;
    return eventTab === 'past' ? isPast : !isPast;
  });

  const focusAreas = [
    { title: t('programs.p1Title'), summary: t('programs.p1Summary'), slug: programs[0]?.slug },
    { title: t('programs.p5Title'), summary: t('programs.p5Summary'), slug: programs[4]?.slug },
    { title: t('programs.p2Title'), summary: t('programs.p2Summary'), slug: programs[1]?.slug },
    { title: t('programs.p6Title'), summary: t('programs.p6Summary'), slug: programs[5]?.slug },
    { title: t('programs.p3Title'), summary: t('programs.p3Summary'), slug: programs[2]?.slug },
    { title: t('programs.p7Title'), summary: t('programs.p7Summary'), slug: programs[6]?.slug },
    { title: t('programs.p4Title'), summary: t('programs.p4Summary'), slug: programs[3]?.slug },
  ];

  return (
    <main className="ohpea-home">
      <section className="ohpea-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(5,35,26,.82),rgba(5,35,26,.35)),linear-gradient(0deg,rgba(5,35,26,.58),rgba(5,35,26,.08)),url(${heroLandscape})` }}>
        <div className="ohpea-hero-inner">
          <span className="ohpea-eyebrow">{t('hero.badge')}</span>
          <h1>
            Elevating Hospitality.<br />
            Connecting Opportunities.<br />
            <em>Discovering Oromia.</em>
          </h1>
          <p>{t('hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3 pt-3">
            <Link to="/register" className="ohpea-button ohpea-button-gold">{t('hero.ctaRegister')} <ArrowIcon size={15} /></Link>
            <Link to="/about" className="ohpea-button ohpea-button-outline">{t('hero.ctaAbout')}</Link>
          </div>
          <div className="ohpea-hero-meta">
            <span>{t('brandTagline')}</span>
            <span>Hospitality · Tourism · Professional Excellence</span>
          </div>
        </div>
      </section>

      <section className="ohpea-intro ohpea-container">
        <div className="ohpea-intro-visual">
          <img className="ohpea-intro-main" src={introPatio} alt="A peaceful hospitality setting overlooking the Oromia landscape" />
          <img className="ohpea-intro-inset" src={introHospitality} alt="Traditional hospitality and coffee service" />
          <span className="ohpea-image-caption">A place to belong. A future to build.</span>
        </div>
        <div className="ohpea-intro-copy">
          <span className="ohpea-eyebrow ohpea-eyebrow-green">{t('about.whoWeAre')}</span>
          <h2>Rooted in Oromia.<br />United by possibility.</h2>
          <p>{t('about.whoWeAreP1')}</p>
          <p>{t('about.whoWeAreP2')}</p>
          <p className="ohpea-script">Local knowledge.<br />Shared ambition. Lasting connection.</p>
          <Link to="/about" className="ohpea-text-link">{t('hero.ctaAbout')} <ArrowIcon size={14} /></Link>
        </div>
      </section>

      <section className="ohpea-stats">
        <div className="ohpea-container ohpea-stats-grid">
          <div className="ohpea-stat-heading"><span className="ohpea-eyebrow ohpea-eyebrow-green">Our contribution</span><span className="ohpea-stat-line" /></div>
          <StatCounter value={stats.totalMembers ?? 0} label={t('stats.registeredMembers')} />
          <StatCounter value={stats.accreditedHotels ?? 0} label={t('stats.activeMembers')} />
          <StatCounter value={stats.certifiedGuides ?? 0} label={t('stats.regionsRepresented')} />
          <StatCounter value={stats.trainingGraduates ?? 0} label={t('stats.activitiesThisYear')} />
        </div>
      </section>

      <section className="ohpea-purpose">
        <div className="ohpea-container ohpea-purpose-grid">
          <div><span className="ohpea-eyebrow ohpea-eyebrow-gold">Our shared purpose</span><h2>A shared purpose.<br />A greater horizon.</h2></div>
          <div className="ohpea-purpose-copy">
            <div><span>01 / Our mission</span><p>{t('generalObjective')}</p></div>
            <div><span>02 / Our vision</span><p>{t('brandTagline')}</p></div>
          </div>
        </div>
      </section>

      <section className="ohpea-container ohpea-focus">
        <div className="ohpea-section-head ohpea-section-head-split">
          <div><span className="ohpea-eyebrow ohpea-eyebrow-green">What we work towards</span><h2>Seven ways forward.<br />One shared ambition.</h2></div>
          <p>From building skills to opening doors, discover the areas where our community can make a difference.</p>
        </div>
        <div className="ohpea-focus-grid">
          {focusAreas.map((item, i) => (
            <Link key={`${item.title}-${i}`} to={item.slug ? `/programs/${item.slug}` : '/programs'} className="ohpea-focus-item">
              <span className="ohpea-focus-number">0{i + 1}</span><span className="ohpea-focus-content"><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        <Link to="/programs" className="ohpea-text-link mt-7">{t('common.viewAll')} {t('nav.programs')} <ArrowIcon size={14} /></Link>
      </section>

      <section className="ohpea-activities">
        <div className="ohpea-container">
          <div className="ohpea-section-head ohpea-section-head-split">
            <div><span className="ohpea-eyebrow ohpea-eyebrow-green">Activities & initiatives</span><h2>Ideas into action.<br />People at the heart.</h2></div>
            <Link to="/updates" className="ohpea-text-link">{t('common.viewAll')} <ArrowIcon size={14} /></Link>
          </div>
          <div className="ohpea-activity-grid">
            {activities.slice(0, 3).map((act, i) => {
              const photo = act.imageUrl || (Array.isArray(act.photos) ? act.photos[0] : null) || activityImages[i % activityImages.length];
              const heading = localize(act.title, language);
              const summary = localize(act.summary ?? act.description, language);
              return <article className="ohpea-activity-card" key={act.id}>
                <img src={photo} alt={heading} loading="lazy" />
                <span className="ohpea-eyebrow ohpea-eyebrow-green">{localize(act.category, language) || 'OPHEA initiative'}</span>
                <h3>{heading}</h3>
                {summary && <p>{summary}</p>}
              </article>;
            })}
            {activities.length === 0 && <div className="ohpea-empty">Our latest activities will appear here soon.</div>}
          </div>
        </div>
      </section>

      <section className="ohpea-member-feature">
        <div className="ohpea-member-image"><img src={memberPortrait} alt="Hospitality professional in a welcoming setting" loading="lazy" /></div>
        <div className="ohpea-member-copy">
          <span className="ohpea-eyebrow ohpea-eyebrow-gold">Build your professional story</span>
          <h2>Your people.<br />Your next chapter.</h2>
          <p>Bring your experience to our community. Share your skills, connect with peers, and help shape hospitality in Oromia.</p>
          <ul><li><Check size={14} /> Professional development</li><li><Check size={14} /> Career and industry connections</li><li><Check size={14} /> A stronger, connected profession</li></ul>
          <Link to="/register" className="ohpea-button ohpea-button-gold">{t('hero.ctaRegister')} <ArrowIcon size={15} /></Link>
        </div>
      </section>

      <section className="ohpea-container ohpea-next">
        <div className="ohpea-section-head"><span className="ohpea-eyebrow ohpea-eyebrow-green">The latest from OPHEA</span><h2>What's next<br />starts here.</h2><p>News, careers, and opportunities from across our professional community.</p><Link to="/updates" className="ohpea-text-link">{t('common.viewAll')} {t('nav.updates')} <ArrowIcon size={14} /></Link></div>
        <div className="ohpea-next-list">
          <Link to="/membership"><span>01 / Membership</span><strong>Careers worth exploring</strong><small>Discover opportunities to grow your professional journey</small><ArrowUpRight size={16} /></Link>
          <Link to="/programs"><span>02 / Our programs</span><strong>Partnerships with purpose</strong><small>Working together to strengthen the sector</small><ArrowUpRight size={16} /></Link>
          {newsItems.slice(0, 2).map((item) => <Link key={item.id} to={`/updates/${item.slug}`}><span>03 / Community news</span><strong>{localize(item.title, language)}</strong><small>{localize(item.summary, language)}</small><ArrowUpRight size={16} /></Link>)}
          {featuredEvent && <Link to={`/updates/${featuredEvent.slug}`}><span>04 / Upcoming events</span><strong>{localize(featuredEvent.title, language)}</strong><small>{localize(featuredEvent.summary, language)}</small><ArrowUpRight size={16} /></Link>}
        </div>
      </section>

      {featuredEvent && <section className="ohpea-event-band"><div className="ohpea-container ohpea-event-inner">
        <div><span className="ohpea-eyebrow ohpea-eyebrow-gold">Mark your calendar</span><h2>{localize(featuredEvent.title, language)}</h2><p>{localize(featuredEvent.summary, language)}</p><div className="flex flex-wrap gap-4 text-xs mt-4">{featuredEvent.eventStartAt && <span className="inline-flex gap-2 items-center"><CalendarDays size={14} />{new Date(featuredEvent.eventStartAt).toLocaleDateString()}</span>}{featuredEvent.location && <span className="inline-flex gap-2 items-center"><MapPin size={14} />{featuredEvent.location}</span>}</div></div>
        <div className="ohpea-event-countdown">{featuredEvent.eventStartAt && <CountdownTimer targetDateString={featuredEvent.eventStartAt} />}<Link to={`/updates/${featuredEvent.slug}`} className="ohpea-button ohpea-button-gold mt-5">{t('common.readMore')} <ArrowIcon size={15} /></Link></div>
      </div></section>}

      {filteredAnnouncements.length > 0 && <section className="ohpea-container ohpea-announcements">
        <div className="ohpea-section-head ohpea-section-head-split"><div><span className="ohpea-eyebrow ohpea-eyebrow-green">Opportunities</span><h2>Stay connected.</h2></div>
          <div className="ohpea-tabs">{(['all', 'vacancy', 'call_for_proposal', 'call_for_research'] as const).map((tab) => <button key={tab} onClick={() => setAnnouncementTab(tab)} className={announcementTab === tab ? 'active' : ''}>{tab === 'all' ? t('common.all') : tab === 'vacancy' ? t('nav.vacancies') : tab === 'call_for_proposal' ? t('nav.callsProposals') : t('nav.callsResearch')}</button>)}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{filteredAnnouncements.slice(0, 3).map((item) => <AnnouncementCard key={item.id} announcement={item} />)}</div>
      </section>}

      {eventItems.length > 0 && <section className="ohpea-container ohpea-events-list">
        <div className="ohpea-section-head ohpea-section-head-split"><div><span className="ohpea-eyebrow ohpea-eyebrow-green">Gatherings & learning</span><h2>{t('home.upcomingEvents')}</h2></div>
          <div className="ohpea-tabs"><button onClick={() => setEventTab('upcoming')} className={eventTab === 'upcoming' ? 'active' : ''}>{t('home.upcomingTab')}</button><button onClick={() => setEventTab('past')} className={eventTab === 'past' ? 'active' : ''}>{t('home.pastTab')}</button></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{eventItems.slice(0, 2).map((evt) => <EventCard key={evt.id} event={evt} />)}</div>
      </section>}

      {programs.length > 0 && <section className="ohpea-programs"><div className="ohpea-container"><div className="ohpea-section-head"><span className="ohpea-eyebrow ohpea-eyebrow-green">{t('home.strategicPillars')}</span><h2>{t('home.strategicPillarsTitle')}</h2><p>{t('home.strategicPillarsDesc')}</p></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{programs.map((program, index) => <ProgramCard key={program.id} program={program} index={index} />)}</div></div></section>}

      <section className="ohpea-container ohpea-partners">
        <div className="ohpea-section-head ohpea-section-head-split"><div><span className="ohpea-eyebrow ohpea-eyebrow-green">Collaboration</span><h2>A stronger sector,<br />together.</h2></div><p>We work alongside partners who share our commitment to a thriving hospitality and tourism sector.</p></div>
        {partners.length > 0 && <PartnerGrid partners={partners} />}
      </section>

      <section className="ohpea-final-cta" style={{ backgroundImage: `linear-gradient(rgba(4,43,31,.72),rgba(4,43,31,.78)),url(${heroLandscape})` }}>
        <span className="ohpea-eyebrow ohpea-eyebrow-gold">The next chapter of Oromia</span><h2>Oromia's next chapter<br />starts with us.</h2><Link to="/register" className="ohpea-button ohpea-button-gold">{t('hero.ctaRegister')} <ArrowIcon size={15} /></Link><small>Join our network of hospitality and tourism professionals.</small>
      </section>
    </main>
  );
};
