(function(){
    const storageKey = 'devlearn-theme';
    const MOON_SVG = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>';
    const SUN_SVG = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36 6.36l-1.42-1.42M7.05 6.64L5.64 5.22m12.02 0l-1.41 1.42M7.05 17.36l-1.41 1.42M12 7a5 5 0 100 10 5 5 0 000-10z"></path></svg>';

    function init() {
        const body = document.body;
        const btn = document.querySelector('#theme-toggle');
        function setTheme(theme) {
            if (theme === 'light') body.classList.add('light');
            else body.classList.remove('light');
            updateButton();
        }
        function updateButton() {
            const b = document.querySelector('#theme-toggle');
            if (!b) return;
            if (body.classList.contains('light')) {
                b.innerHTML = SUN_SVG;
                b.setAttribute('aria-label', 'Switch to dark');
            } else {
                b.innerHTML = MOON_SVG;
                b.setAttribute('aria-label', 'Switch to light');
            }
        }
        // load saved preference
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) setTheme(saved);
        } catch (e) { /* ignore */ }

        if (btn) {
            btn.addEventListener('click', function() {
                const isLight = body.classList.toggle('light');
                try { localStorage.setItem(storageKey, isLight ? 'light' : 'dark'); } catch(e){}
                updateButton();
            });
        }

        // in case pages dynamically add the button later, set icon now
        updateButton();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') init();
    else document.addEventListener('DOMContentLoaded', init);
})();
