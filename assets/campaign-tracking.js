(() => {
  'use strict';
  const config = window.U2K_ANALYTICS || {};
  const id = /^G-[A-Z0-9]{6,20}$/.test(config.ga4Id || '') ? config.ga4Id : '';
  const key = 'u2k-measurement-consent';
  let consent = 'unset', started = false, formStarted = false;
  try { consent = localStorage.getItem(key) || 'unset'; } catch (_) {}
  const routes = new Set(['/', '/index.html', '/services', '/pricing', '/industries', '/about', '/careers', '/contact', '/privacy', '/doctors']);
  const route = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const safePath = route === '/index' ? '/' : routes.has(route) ? route : '/other';
  const pageType = /^\/doctors(?:\.html)?\/?$/.test(location.pathname) ? 'doctors' : 'website';
  const allowed = new Set(['landing_view','section_view','pricing_interest','enquiry_start','enquiry_draft_prepared','email_app_open']);
  const allowedSections = new Set(['services','pricing','enquire','contact','how-it-works','scope','faq']);
  const sectionAliases = {'practice-services':'services','practice-plans':'pricing','practice-enquiry':'enquire'};
  const sent = new Set();
  let campaign = null;
  const trustedCampaigns = new Map([
    ['doctors-google',{campaign_code:'doctors-google',campaign_source:'google',campaign_medium:'cpc',campaign_name:'doctors_practice_it'}],
    ['doctors-youtube',{campaign_code:'doctors-youtube',campaign_source:'youtube',campaign_medium:'paid_video',campaign_name:'doctors_practice_it'}],
    ['doctors-facebook',{campaign_code:'doctors-facebook',campaign_source:'facebook',campaign_medium:'paid_social',campaign_name:'doctors_practice_it'}],
    ['doctors-instagram',{campaign_code:'doctors-instagram',campaign_source:'instagram',campaign_medium:'paid_social',campaign_name:'doctors_practice_it'}],
    ['doctors-tiktok',{campaign_code:'doctors-tiktok',campaign_source:'tiktok',campaign_medium:'paid_social',campaign_name:'doctors_practice_it'}]
  ]);
  function event(name, detail = {}) {
    if (consent !== 'accepted' || !started || !allowed.has(name)) return;
    const payload = {page_path:safePath, page_location:location.origin + safePath, page_referrer:'', landing_type:pageType};
    if (campaign) Object.assign(payload,campaign);
    if (allowedSections.has(detail.section)) payload.section_name = detail.section;
    // No field values, labels, link URLs, query strings, referrers or identifiers enter this payload.
    window.gtag('event', name, payload);
  }
  function start() {
    if (started || consent !== 'accepted' || !id || config.sensitiveAutoTrackingDisabled !== true) return;
    window['ga-disable-'+id] = false;
    started = true;
    // Read only one campaign selector after consent; emit code-owned values, never URL input.
    if (pageType === 'doctors') campaign = trustedCampaigns.get(new URLSearchParams(location.search).get('campaign')) || null;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:true,page_location:location.origin+safePath,page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false,...(campaign || {})});
    const script=document.createElement('script');script.async=true;script.referrerPolicy='no-referrer';script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
    if (pageType === 'doctors') event('landing_view');
  }
  const banner=document.createElement('section');banner.className='tracking-consent';banner.setAttribute('aria-label','Analytics preferences');
  const message=document.createElement('p');message.textContent='Allow optional analytics to help us understand which pages and enquiry steps are useful? We do not send your form details to analytics. Advertising tracking is not enabled.';banner.append(message);
  function choose(value) {
    consent=value;
    if(id) window['ga-disable-'+id] = value !== 'accepted';
    try{localStorage.setItem(key,value);}catch(_){}
    banner.hidden=true;
    if(value==='accepted'){if(started)window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});else start();}
    else if(started){window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
  }
  for(const [text,value]of [['Accept analytics','accepted'],['Reject analytics','rejected']]){const button=document.createElement('button');button.type='button';button.textContent=text;button.addEventListener('click',()=>choose(value));banner.append(button);}
  // Do not show an unnecessary consent banner when measurement has not been configured.
  banner.hidden=!id || config.sensitiveAutoTrackingDisabled!==true || consent!=='unset';document.body.append(banner);
  const settings=document.createElement('button');settings.type='button';settings.className='tracking-settings';settings.textContent='Analytics preferences';settings.hidden=!id || config.sensitiveAutoTrackingDisabled!==true;settings.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus();});(document.querySelector('.footer-bottom')||document.body).append(settings);
  start();
  document.addEventListener('focusin',e=>{if(e.target.closest('#brief-form')&&!formStarted){formStarted=true;event('enquiry_start');}});
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('mailto:'))event('email_app_open');else if(href==='#pricing'||href==='#practice-plans'||a.hasAttribute('data-select-plan')||a.hasAttribute('data-doctor-plan'))event('pricing_interest');});
  const form=document.querySelector('#brief-form');if(form)new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches('.brief-result')||n.querySelector('.brief-result')))))event('enquiry_draft_prepared');}).observe(form,{childList:true,subtree:true});
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||consent!=='accepted'||!started)return;const section=sectionAliases[entry.target.id]||entry.target.id;if(!allowedSections.has(section)||sent.has(section))return;sent.add(section);event('section_view',{section});}),{threshold:.3});document.querySelectorAll('section[id]').forEach(s=>observer.observe(s));}
})();
