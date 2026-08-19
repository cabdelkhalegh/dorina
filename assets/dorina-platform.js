
const body=document.body;const btn=document.querySelector('[data-lang]');function setLang(l){let lang=l==='ar'?'ar':'en';body.classList.toggle('ar',lang==='ar');document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';localStorage.setItem('dorinaLang',lang);document.querySelectorAll('[data-placeholder-en]').forEach(el=>el.placeholder=el.dataset[lang==='ar'?'placeholderAr':'placeholderEn']);document.querySelectorAll('option[data-en]').forEach(o=>o.textContent=o.dataset[lang]);}if(btn)btn.onclick=()=>setLang(body.classList.contains('ar')?'en':'ar');setLang(localStorage.getItem('dorinaLang')||'en');const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;document.querySelectorAll('.reveal').forEach(e=>io?io.observe(e):e.classList.add('in'));
const form=document.querySelector('#contactForm');if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const ar=body.classList.contains('ar');const interest=d.get('interest');const msg=ar?`مرحباً دورينا، أنا ${d.get('name')}. أودّ التواصل بخصوص: ${interest}. وسيلة التواصل: ${d.get('contact')}. ${d.get('message')?`ما أريد توضيحه: ${d.get('message')}.`:''} شكراً.`:`Hello Dorina, my name is ${d.get('name')}. I would like to ask about: ${interest}. Contact: ${d.get('contact')}. ${d.get('message')?`What I would like to clarify: ${d.get('message')}.`:''} Thank you.`;document.querySelector('#preparedMessage').value=msg;document.querySelector('#result').hidden=false;});}

// coherence pass: staggered reveals + nav scroll state (fail-safe: content visible unless js-anim)
(function(){
  document.documentElement.classList.add('js-anim');
  // elements already in the first viewport appear instantly (no observer dependence)
  var vh=window.innerHeight||900;
  document.querySelectorAll('.reveal').forEach(function(el){
    var r=el.getBoundingClientRect();
    if(r.top<vh*0.9){el.classList.add('in','instant')}
  });
  var groups={};
  document.querySelectorAll('.reveal').forEach(function(el){
    var p=el.parentElement; (groups[p]=groups[p]||[]).push(el);
    var siblings=p.querySelectorAll(':scope > .reveal');
    var i=Array.prototype.indexOf.call(siblings,el);
    if(i>0) el.style.setProperty('--d',(Math.min(i,4)*0.12)+'s');
  });
  var nav=document.querySelector('.nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>10)},{passive:true});}
})();

// premium pass v2: mobile menu, WhatsApp wiring (Gate A open)
(function(){
  var WA='971543383932';
  function waHref(m){return 'https://wa.me/'+WA+(m?'?text='+encodeURIComponent(m):'')}
  function isAr(){return document.body.classList.contains('ar')}
  var WAICON='<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5v-.5L9.7 7.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 2.6 1.1 2.6.7 3.1.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z"/></svg>';

  // mobile menu (injected, so every shared page gets it without markup edits)
  var inner=document.querySelector('.nav-inner'), links=document.querySelector('.links');
  if(inner&&links){
    var b=document.createElement('button');b.className='menu-btn';b.setAttribute('aria-label','Menu');b.textContent='☰';
    b.onclick=function(){var o=links.classList.toggle('open');b.textContent=o?'✕':'☰'};
    inner.insertBefore(b, inner.querySelector('.lang'));
    links.addEventListener('click',function(e){if(e.target.closest('a')){links.classList.remove('open');b.textContent='☰'}});
  }

  // footer WhatsApp chip on every page
  var foot=document.querySelector('.footer .wrap');
  if(foot){
    var a=document.createElement('a');a.className='wa-cta';a.target='_blank';a.rel='noopener';
    a.href=waHref(isAr()?'مرحباً دورينا':'Hello Dorina');
    a.innerHTML=WAICON+'<span data-en>WhatsApp Dorina</span><span data-ar>راسلي دورينا واتساب</span>';
    var wrap=document.createElement('div');wrap.appendChild(a);foot.appendChild(wrap);
  }

  // contact form: prepared message hands off to WhatsApp in one tap
  var res=document.querySelector('#result'), form=document.querySelector('#contactForm');
  if(res&&form){
    var wa=document.createElement('a');wa.className='wa-cta';wa.target='_blank';wa.rel='noopener';wa.style.marginTop='12px';
    wa.innerHTML=WAICON+'<span data-en>Send via WhatsApp</span><span data-ar>أرسلي عبر واتساب</span>';
    res.appendChild(wa);
    form.addEventListener('submit',function(){setTimeout(function(){
      var m=document.querySelector('#preparedMessage');
      if(m&&m.value)wa.href=waHref(m.value);
    },0)});
  }
})();
