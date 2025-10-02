(function(){
  const $name = $('#nameInput');
  const $template = $('#templateSelect');
  const canvas = document.getElementById('posterCanvas');
  const ctx = canvas.getContext('2d');
  const parallax = document.getElementById('parallaxContainer');
  const glow = document.getElementById('cursorGlow');

  const TEMPLATE_MAP = window.POSTER_TEMPLATES || {};

  function loadImage(src){
    return new Promise((resolve, reject)=>{
      const img = new Image();
      img.onload = ()=>resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function drawPoster(){
    const name = ($name.val() || '').trim() || 'Your Name';
    const key = $template.val();
    const bgSrc = TEMPLATE_MAP[key];

    // Clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    try{
      const bg = await loadImage(bgSrc);
      // Draw background full bleed
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }catch(e){
      // fallback background
      const grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
      grd.addColorStop(0,'#051021'); grd.addColorStop(1,'#0c1f33');
      ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    // Draw cinematic overlay vignette
    const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height*0.4, canvas.width*0.1, canvas.width/2, canvas.height/2, canvas.width*0.8);
    vignette.addColorStop(0,'rgba(0,0,0,0.0)');
    vignette.addColorStop(1,'rgba(0,0,0,0.65)');
    ctx.fillStyle = vignette; ctx.fillRect(0,0,canvas.width,canvas.height);

    // Text area parameters (bottom third)
    const marginX = 80;
    const maxWidth = canvas.width - marginX*2; // constrained area
    const baselineY = canvas.height * 0.82;

    // Auto-fit font sizing using binary search
    function fitFont(text, fontFamily){
      let lo = 24, hi = 160, best = 48;
      while(lo <= hi){
        const mid = Math.floor((lo+hi)/2);
        ctx.font = `700 ${mid}px ${fontFamily}`;
        const metrics = ctx.measureText(text);
        const width = metrics.width;
        if(width <= maxWidth){ best = mid; lo = mid+1; } else { hi = mid-1; }
      }
      return best;
    }

    const fontFamily = 'Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    const fontSize = fitFont(name.toUpperCase(), fontFamily);

    // Glow and stroke for readability
    ctx.font = `800 ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(49,195,255,0.6)';
    ctx.shadowBlur = Math.max(8, fontSize*0.12);
    ctx.lineWidth = Math.max(2, fontSize*0.06);

    // Stroke and fill
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.fillStyle = '#e6f1ff';
    ctx.strokeText(name.toUpperCase(), canvas.width/2, baselineY);
    ctx.fillText(name.toUpperCase(), canvas.width/2, baselineY);
  }

  // Parallax & cursor glow
  function onMouseMove(e){
    const rect = parallax.getBoundingClientRect();
    const cx = e.clientX - rect.left; const cy = e.clientY - rect.top;
    const px = (cx/rect.width - 0.5); const py = (cy/rect.height - 0.5);

    // Move layers subtly
    const back = parallax.querySelector('.layer-back');
    const mid = parallax.querySelector('.layer-mid');
    const front = parallax.querySelector('.layer-front');
    back.style.transform = `translateZ(-20px) translate(${px*-10}px, ${py*-10}px) scale(1.05)`;
    mid.style.transform = `translateZ(-10px) translate(${px*-6}px, ${py*-6}px) scale(1.02)`;
    front.style.transform = `translateZ(0) translate(${px*4}px, ${py*4}px)`;

    // Glow follow
    glow.style.display = 'block';
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }
  function onMouseLeave(){ glow.style.display = 'none'; }

  // Download helpers
  function downloadCanvas(mime, filename){
    // Force white background for JPG
    let dataURL;
    if(mime === 'image/jpeg'){
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width; tmp.height = canvas.height;
      const tctx = tmp.getContext('2d');
      tctx.fillStyle = '#000';
      tctx.fillRect(0,0,tmp.width,tmp.height);
      tctx.drawImage(canvas,0,0);
      dataURL = tmp.toDataURL(mime, 0.92);
    } else {
      dataURL = canvas.toDataURL(mime);
    }
    const a = document.createElement('a');
    a.href = dataURL; a.download = filename; a.click();
  }

  // Save to server
  async function saveToServer(){
    const name = ($name.val()||'').trim();
    if(!name){ return false; }
    // Default PNG payload
    const dataURL = canvas.toDataURL('image/png');
    const res = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, template: $template.val(), imageData: dataURL })
    });
    const json = await res.json();
    if(json && json.ok){
      if(json.redirect){ window.location.assign(json.redirect); }
      return true;
    } else {
      alert(json.error || 'Failed to save.');
      return false;
    }
  }

  // Form validation and events
  $('#posterForm').on('submit', async function(e){
    e.preventDefault();
    if(!this.checkValidity()){
      e.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    await saveToServer();
  });

  $('#downloadPngBtn').on('click', ()=> downloadCanvas('image/png', 'cinema_poster.png'));
  $('#downloadJpgBtn').on('click', ()=> downloadCanvas('image/jpeg', 'cinema_poster.jpg'));
  $('#resetBtn').on('click', ()=>{ $name.val(''); drawPoster(); });

  $name.on('input', drawPoster);
  $template.on('change', drawPoster);

  parallax.addEventListener('mousemove', onMouseMove);
  parallax.addEventListener('mouseleave', onMouseLeave);

  // First render
  drawPoster();
})();
