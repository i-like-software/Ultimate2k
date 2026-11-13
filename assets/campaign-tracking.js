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
  const allowed = new Set(['landing_view','section_view','pricing_interest','enquiry_start','enquiry_draft_prepared','email_app_open','scroll_depth']);
  const allowedSections = new Set(['services','pricing','enquire','contact','how-it-works','scope','faq']);
  const sectionAliases = {'practice-services':'services','practice-plans':'pricing','practice-enquiry':'enquire'};
  const sent = new Set();
  function event(name, detail = {}) {
    if (consent !== 'accepted' || !started || !allowed.has(name)) return;
    const payload = {page_path:safePath, page_location:location.origin + safePath, page_referrer:'', landing_type:pageType};
    if (allowedSections.has(detail.section)) payload.section_name = detail.section;
    if ([25,50,75,90].includes(detail.depth)) payload.scroll_percent = detail.depth;
    // No field values, labels, link URLs, query strings, referrers or identifiers enter this payload.
    window.gtag('event', name, payload);
  }
  function start() {
    if (started || consent !== 'accepted' || !id || config.enhancedMeasurementDisabled !== true) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:false,page_location:location.origin+safePath,page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false});
    const script=document.createElement('script');script.async=true;script.referrerPolicy='no-referrer';script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
    event('landing_view');
    window.gtag('event','page_view',{page_location:location.origin+safePath,page_path:safePath,page_referrer:''});
  }
  const banner=document.createElement('section');banner.className='tracking-consent';banner.setAttribute('aria-label','Analytics preferences');
  const message=document.createElement('p');message.textContent='Allow optional analytics to help us understand which pages and enquiry steps are useful? We do not send your form details to analytics. Advertising tracking is not enabled.';banner.append(message);
  function choose(value) {
    consent=value;try{localStorage.setItem(key,value);}catch(_){}
    banner.hidden=true;
    if(value==='accepted'){if(started)window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});else start();}
    else if(started){window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}
  }
  for(const [text,value]of [['Accept analytics','accepted'],['Reject analytics','rejected']]){const button=document.createElement('button');button.type='button';button.textContent=text;button.addEventListener('click',()=>choose(value));banner.append(button);}
  // Do not show an unnecessary consent banner when measurement has not been configured.
  banner.hidden=!id || config.enhancedMeasurementDisabled!==true || consent!=='unset';document.body.append(banner);
  const settings=document.createElement('button');settings.type='button';settings.className='tracking-settings';settings.textContent='Analytics preferences';settings.hidden=!id || config.enhancedMeasurementDisabled!==true;settings.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus();});(document.querySelector('.footer-bottom')||document.body).append(settings);
  start();
  document.addEventListener('focusin',e=>{if(e.target.closest('#brief-form')&&!formStarted){formStarted=true;event('enquiry_start');}});
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('mailto:'))event('email_app_open');else if(href==='#pricing'||href==='#practice-plans'||a.hasAttribute('data-select-plan')||a.hasAttribute('data-doctor-plan'))event('pricing_interest');});
  const form=document.querySelector('#brief-form');if(form)new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches('.brief-result')||n.querySelector('.brief-result')))))event('enquiry_draft_prepared');}).observe(form,{childList:true,subtree:true});
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||consent!=='accepted'||!started)return;const section=sectionAliases[entry.target.id]||entry.target.id;if(!allowedSections.has(section)||sent.has(section))return;sent.add(section);event('section_view',{section});}),{threshold:.3});document.querySelectorAll('section[id]').forEach(s=>observer.observe(s));}
  window.addEventListener('scroll',()=>{if(consent!=='accepted'||!started)return;const height=document.documentElement.scrollHeight-innerHeight;if(height<=0)return;const percent=scrollY/height*100;for(const depth of [25,50,75,90])if(percent>=depth&&!sent.has(depth)){sent.add(depth);event('scroll_depth',{depth});}},{passive:true});
})();
