(function(){
  var f=document.querySelector("form.form"); if(!f) return;
  var t0=Date.now(), touched=false;
  ["keydown","pointerdown","input"].forEach(function(e){f.addEventListener(e,function(){touched=true;},{passive:true});});
  var stat=f.querySelector(".stat");
  function say(c,m){stat.className="stat "+c;stat.textContent=m;}
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var hp=f.querySelector('input[name="_honey"]');
    if(hp&&hp.value){done();return;}
    if(Date.now()-t0<3000||!touched){say("err","That was quick. Give it a few seconds and press send again.");return;}
    var miss=null;
    Array.prototype.forEach.call(f.querySelectorAll("[required]"),function(el){el.removeAttribute("aria-invalid");if(!miss&&!el.value.trim())miss=el;});
    var em=f.querySelector('input[type="email"]');
    if(!miss&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim()))miss=em;
    if(miss){miss.setAttribute("aria-invalid","true");say("err","Please fill in the highlighted field.");miss.focus();return;}
    var off=f.querySelector('input[name="Offer"]'); if(off) off.value=off.value.replace(/[^0-9.,]/g,"").slice(0,12);
    var b=f.querySelector('button[type="submit"]'); b.disabled=true; b.textContent="Sending...";
    var url="https://formsubmit.co/ajax/"+atob(f.dataset.a)+String.fromCharCode(64)+atob(f.dataset.b);
    fetch(url,{method:"POST",body:new FormData(f),headers:{"Accept":"application/json"}})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){return r.ok&&(j.success===true||j.success==="true");});})
      .then(function(ok){ok?done():fail();}).catch(fail);
    function fail(){b.disabled=false;b.textContent="Send my offer";say("err","That did not go through. Please try again or call 1-800-481-8638.");}
  });
  function done(){
    var d=document.createElement("div");d.className="done";d.setAttribute("role","status");d.tabIndex=-1;
    d.textContent="Thanks. Your offer on "+f.dataset.d+" is in. A person at Eye To Ad Media will reply, usually within one business day.";
    f.parentNode.replaceChild(d,f);d.focus();
  }
})();
