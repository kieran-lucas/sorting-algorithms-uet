
(() => {
  const sections=[...document.querySelectorAll('.algorithm')];
  const navlinks=[...document.querySelectorAll('.side-link')];
  const codePanels=[...document.querySelectorAll('[data-codepanel]')];
  const menu=document.querySelector('.mobile-menu');
  menu.addEventListener('click',()=>{const open=document.querySelector('.sidebar').classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Đóng menu ×':'Mục lục ☰';});
  navlinks.forEach(a=>a.addEventListener('click',()=>{document.querySelector('.sidebar').classList.remove('nav-open');menu.setAttribute('aria-expanded','false');menu.textContent='Mục lục ☰';}));
  const setActive=(id)=>{navlinks.forEach(a=>{let on=a.hash==='#'+id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});};
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      let active=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(active) setActive(active.target.id);
    },{rootMargin:'-10% 0px -58% 0px',threshold:[0,.1,.3,.6]});
    sections.forEach(s=>observer.observe(s));
  }
  let ticking=false;
  const updateProgress=()=>{let max=document.documentElement.scrollHeight-window.innerHeight;document.querySelector('.progress-bar').style.width=(max>0?(window.scrollY/max)*100:100)+'%';ticking=false;};
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true;}},{passive:true});updateProgress();
  codePanels.forEach(panel=>{
    const pre=panel.querySelector('.code-body'); const expand=panel.querySelector('.expand-code'); const copy=panel.querySelector('.copy-code');
    expand.addEventListener('click',()=>{const expanded=panel.classList.toggle('expanded');expand.setAttribute('aria-expanded',String(expanded));expand.innerHTML=expanded?'Thu gọn <span aria-hidden="true">↗</span>':'Mở rộng <span aria-hidden="true">↗</span>';updateProgress();});
    copy.addEventListener('click',async()=>{const text=pre.textContent;try {await navigator.clipboard.writeText(text);const old=copy.textContent;copy.textContent='Đã sao chép ✓';setTimeout(()=>copy.textContent=old,1800);}catch(_){const r=document.createRange();r.selectNodeContents(pre);getSelection().removeAllRanges();getSelection().addRange(r);copy.textContent='Đã chọn code';setTimeout(()=>copy.textContent='Sao chép',1800);}});
  });
  document.querySelectorAll('[data-output]').forEach(output=>{
    const steps=[...output.querySelectorAll('.trace-step')];
    const btns=[...output.querySelectorAll('.view-btn')];
    const focus=output.querySelector('.focus-controls');
    const slider=focus.querySelector('input');
    const pos=focus.querySelector('.focus-position');
    const prev=focus.querySelector('.prev-step');
    const next=focus.querySelector('.next-step');
    let selected=0;
    const goto=(index)=>{selected=Math.max(0,Math.min(steps.length-1,index));steps.forEach((e,i)=>e.classList.toggle('is-current',i===selected));slider.value=selected+1;pos.textContent=`Bước ${selected+1} / ${steps.length}`;prev.disabled=selected===0;next.disabled=selected===steps.length-1;};
    btns.forEach(btn=>btn.addEventListener('click',()=>{
      const isFocus=btn.dataset.mode==='focus';output.classList.toggle('is-focus',isFocus);focus.hidden=!isFocus;btns.forEach(x=>{const active=x===btn;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});if(isFocus)goto(selected);requestAnimationFrame(updateProgress);
    }));
    prev.addEventListener('click',()=>goto(selected-1));next.addEventListener('click',()=>goto(selected+1));slider.addEventListener('input',()=>goto(Number(slider.value)-1));
    output.addEventListener('keydown',ev=>{if(!output.classList.contains('is-focus'))return;if(ev.target===slider)return;if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();goto(selected+(ev.key==='ArrowRight'?1:-1));}});
    goto(0);
  });
})();
