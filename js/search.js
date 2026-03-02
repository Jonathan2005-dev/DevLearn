(function(){
  const input = document.getElementById('searchInput');
  if (!input) return;
  const resultsEl = document.createElement('div');
  resultsEl.id = 'searchResults';
  resultsEl.className = 'absolute left-0 right-0 mt-2 bg-white/95 text-slate-900 rounded-lg shadow-lg max-h-72 overflow-auto z-50';
  resultsEl.style.display = 'none';
  // place after input's parent
  const wrapper = input.closest('.flex') || input.parentElement;
  wrapper.style.position = 'relative';
  wrapper.appendChild(resultsEl);

  function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  function highlight(text, words){
    let t = text;
    words.forEach(w=>{
      if (!w) return;
      const re = new RegExp('('+escapeRegex(w)+')','ig');
      t = t.replace(re, '<mark class="bg-yellow-200 text-black">$1</mark>');
    });
    return t;
  }

  function search(q){
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const idx = window.DEVLEARN_SEARCH_INDEX || [];
    const results = [];
    idx.forEach(item=>{
      const hay = (item.title + ' ' + item.content).toLowerCase();
      const matchedWords = words.filter(w => hay.includes(w));
      if (matchedWords.length>0){
        // score by matched word count and occurrences
        let score = matchedWords.length;
        matchedWords.forEach(w => { score += (hay.split(w).length - 1) * 0.1; });
        results.push({item,score,matchedWords});
      }
    });
    results.sort((a,b)=>b.score - a.score);
    return results;
  }

  let debounceTimer = null;
  input.addEventListener('input', (e)=>{
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=>{
      const q = input.value;
      if (!q.trim()){ resultsEl.style.display='none'; resultsEl.innerHTML=''; return; }
      const res = search(q);
      if (!res.length){ resultsEl.style.display='block'; resultsEl.innerHTML = '<div class="p-3 text-sm text-gray-600">No results</div>'; return; }
      resultsEl.style.display='block';
      resultsEl.innerHTML = res.slice(0,10).map(r=>{
        const title = highlight(r.item.title, r.matchedWords);
        // create snippet around first matched word
        const hay = r.item.content;
        const mw = r.matchedWords[0] || '';
        let idx = hay.toLowerCase().indexOf(mw);
        let snippet = hay;
        if (idx>-1){
          const start = Math.max(0, idx-40);
          const end = Math.min(hay.length, idx+60);
          snippet = (start>0? '...':'') + hay.substring(start,end) + (end<hay.length? '...':'');
        }
        snippet = highlight(snippet, r.matchedWords);
        return `<a href="${r.item.url}" class="block px-4 py-3 hover:bg-gray-100/60 border-b last:border-b-0"><div class="font-semibold">${title}</div><div class="text-sm text-gray-700 mt-1">${snippet}</div></a>`;
      }).join('');
    },200);
  });

  document.addEventListener('click', (e)=>{
    if (!resultsEl.contains(e.target) && e.target !== input) {
      resultsEl.style.display = 'none';
    }
  });
})();
