
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
