/**
 * main.js – Portfolio application logic
 * Hardened for OWASP alignment: no inline scripts, SRI-ready external assets.
 * Australian English comments throughout.
 */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
   Initialising core system navigation – mobile menu collapse and hamburger toggle
   ========================================================================== */
$(document).ready(function() {
    var $menu = $('#d2c_header_mobile');
    var $icon = $('.d2c_header_toggler_icon');

    $menu.on('show.bs.collapse', function() {
        $icon.removeClass('fa-bars').addClass('fa-times');
    });
    $menu.on('hide.bs.collapse', function() {
        $icon.removeClass('fa-times').addClass('fa-bars');
    });

    $('.d2c_header_mobile .d2c_header_link[href^="#"]').on('click', function() {
        if ($menu.hasClass('show')) {
            var bsCollapse = bootstrap.Collapse.getInstance($menu[0]);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});

// WOW JS – scroll-triggered reveal animations (safety check if CDN fails)
    if (typeof WOW === 'function') { new WOW().init(); }

/* Tap-to-expand for skills tiles on touch devices (hover: none) */
(function() {
    if (!window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.d2c_skills_tile').forEach(function(tile) {
        tile.addEventListener('click', function() {
            var wasTapped = this.classList.contains('d2c_skills_tile--tapped');
            document.querySelectorAll('.d2c_skills_tile.d2c_skills_tile--tapped').forEach(function(t) {
                if (t !== tile) t.classList.remove('d2c_skills_tile--tapped');
            });
            this.classList.toggle('d2c_skills_tile--tapped', !wasTapped);
        });
    });
})();

/* GSAP plugin registration – ScrollTrigger required for scroll-driven animations */
(function() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
})();

/* Mapping project telemetry – ScrollTrigger-driven section reveals, decrypt headers, line splits */
(function() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var scrollTriggerStart = 'top 85%';
    gsap.context(function() {

    // Scroll progress bar – True Cyan bar fills as user scrolls
    var progressBar = document.getElementById('d2c_scroll_progress');
    if (progressBar) {
        ScrollTrigger.create({
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: function(self) {
                gsap.set(progressBar, { scaleX: self.progress, transformOrigin: 'left' });
            }
        });
    }

    // Reusable decrypt: syncs with Hero scramble logic (ScrambleTextPlugin) – no auto-start
    var hasScramble = typeof ScrambleTextPlugin !== 'undefined';
    if (hasScramble) gsap.registerPlugin(ScrambleTextPlugin);

    function decryptTitle(element) {
        if (!element) return;
        var text = element.dataset.decryptText || element.textContent;
        if (!text) return;
        element.textContent = '';
        var duration = Math.max(1.2, Math.min(3, text.length * 0.08));
        gsap.to(element, { opacity: 1, duration: 0.2 });
        if (hasScramble) {
            gsap.fromTo(element, { x: gsap.utils.random(-4, 4) }, {
                x: 0,
                duration: 0.06,
                repeat: 2,
                yoyo: true,
                ease: 'none',
                onComplete: function() {
                    gsap.to(element, {
                        duration: duration,
                        scrambleText: {
                            text: text,
                            chars: 'upperCase',
                            revealDelay: 0.6,
                            speed: 0.25,
                            tweenLength: true
                        },
                        ease: 'power2.inOut'
                    });
                }
            });
        } else {
            element.textContent = text;
        }
    }

    // Section titles: store text, clear, hide – then ScrollTrigger onEnter runs decryptTitle once
    var headerSelectors = '.d2c_about_heading, .d2c_experience_section_title, .d2c_project_section_title, .d2c_comms_title';
    var sectionTitles = gsap.utils.toArray(headerSelectors);

    sectionTitles.forEach(function(el) {
        el.dataset.decryptText = el.textContent;
        el.textContent = '';
    });

    sectionTitles.forEach(function(el) {
        ScrollTrigger.create({
            trigger: el,
            start: scrollTriggerStart,
            once: true,
            onEnter: function() {
                decryptTitle(el);
            }
        });
    });

    // Modular Line Reveal: wrap elements in masks, animate from y (Hero, 01_WHOAMI, 02_LOGS, 03_PROJECTS)
    function createLineReveal(elements, options) {
        options = options || {};
        var els = Array.isArray(elements) ? elements : (typeof elements === 'string' ? document.querySelectorAll(elements) : [elements]);
        if (!els.length) return null;
        var allInners = [];
        els.forEach(function(el) {
            var mask = document.createElement('div');
            mask.className = 'd2c_line_mask';
            var inner = document.createElement('span');
            inner.className = 'd2c_line_inner';
            inner.innerHTML = el.innerHTML;
            mask.appendChild(inner);
            el.innerHTML = '';
            el.appendChild(mask);
            allInners.push(inner);
        });
        var vars = {
            duration: options.duration || 1.2,
            y: options.y !== undefined ? options.y : 50,
            opacity: 0,
            stagger: options.stagger || 0.1,
            ease: options.ease || 'power4.out'
        };
        if (options.scrollTrigger) {
            vars.scrollTrigger = options.scrollTrigger;
            gsap.from(allInners, vars);
        } else if (options.addTo) {
            options.addTo.from(allInners, vars, options.position || '+=0');
        }
        return allInners;
    }

    // 01_WHOAMI and 02_LOGS: Classified Redaction handled by initCyberInteractions()
    createLineReveal('#project .d2c_project_section_desc', {
        scrollTrigger: { trigger: '#project', start: scrollTriggerStart, toggleActions: 'play none none none' }
    });

    window.d2c_createLineReveal = createLineReveal;

    // Staggered project tags reveal
    gsap.set('.d2c_tag', { opacity: 0, y: 8 });
    gsap.to('.d2c_tag', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.d2c_project_card_grid', start: scrollTriggerStart, toggleActions: 'play none none none' }
    });

    // Bento Grid Reveal: fade in and slide up with cascading stagger when grid enters viewport
    gsap.set('#experience .d2c_bento_tile', { y: 50, opacity: 0 });
    gsap.to('#experience .d2c_bento_tile', {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#experience .d2c_bento_grid',
            start: scrollTriggerStart,
            toggleActions: 'play none none none'
        }
    });

    // Interactive Hover States: scale and unified True Cyan glow on bento tiles
    gsap.utils.toArray('.d2c_bento_tile').forEach(function(tile) {
        tile.addEventListener('mouseenter', function() {
            gsap.to(tile, {
                scale: 1.02,
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        tile.addEventListener('mouseleave', function() {
            gsap.to(tile, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });

    // Neon Flicker: subtle random opacity on education titles (Neon Purple #FF00FF)
    function runNeonFlicker(el) {
        gsap.to(el, {
            opacity: 0.92 + Math.random() * 0.08,
            duration: 0.08 + Math.random() * 0.12,
            ease: 'none',
            delay: 0.05 + Math.random() * 0.2,
            onComplete: function() { runNeonFlicker(el); }
        });
    }
    gsap.utils.toArray('.d2c_edu_title').forEach(runNeonFlicker);

    // Parallax: about image and project card backgrounds move at different speed on scroll
    gsap.utils.toArray('.d2c_about_img_frame, .d2c_project_card_bg').forEach(function(el) {
        gsap.to(el, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // Header shrink on scroll
    ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: '+=150',
        scrub: true,
        onUpdate: function(self) {
            gsap.set('.d2c_header_inner', { scale: 1 - self.progress * 0.08, transformOrigin: 'center top' });
        }
    });

    // DrawSVG: contact section line draws in when scrolled into view
    if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
        var connectLine = document.querySelector('.d2c_connect_line line');
        if (connectLine) {
            gsap.fromTo(connectLine, { drawSVG: '0% 0%' }, {
                drawSVG: '0% 100%',
                duration: 1,
                ease: 'power2.inOut',
                scrollTrigger: { trigger: '#contact', start: scrollTriggerStart, toggleActions: 'play none none none' }
            });
        }
    }
    }, document);
})();

/* System Stack – horizontal row, scroll-triggered fade-in, glow/hover via CSS */
(function() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var stage = document.querySelector('.d2c_stack_stage');
    if (!stage) return;

    var items = gsap.utils.toArray('.d2c_stack_stage .d2c_toolkit_item');
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 12 });
    gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: stage, start: 'top 85%', toggleActions: 'play none none none' }
    });
})();

/* Magnetic buttons – hero CTAs subtly follow cursor on desktop */
(function() {
    if (typeof gsap === 'undefined') return;
    gsap.matchMedia().add('(min-width: 768px)', function() {
        var btns = gsap.utils.toArray('.d2c_hero_btn_primary, .d2c_hero_btn_ghost');
        btns.forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                var rect = btn.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(btn, { x: x * 8, y: y * 4, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', function() {
                gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
            });
        });
    });
})();

/* 3D tilt on project cards – desktop only, disabled on mobile for performance */
(function() {
    if (typeof gsap === 'undefined') return;

    gsap.matchMedia().add('(min-width: 768px)', function() {
        var cards = gsap.utils.toArray('.d2c_project_card_glass');
        cards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                var rotateX = Math.max(-5, Math.min(5, -y * 10));
                var rotateY = Math.max(-5, Math.min(5, x * 10));
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 800,
                    duration: 0.25,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', function() {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.35,
                    ease: 'power2.out'
                });
            });
        });
    });
})();

/* Hero boot sequence – staged system boot UI with scramble headline and credential reveal */
(function() {
    var bootEl = document.getElementById('d2c_hero_boot');
    var mainEl = document.getElementById('d2c_hero_main');
    var headlineEl = document.getElementById('d2c_hero_headline_text');
    var caretEl = document.getElementById('d2c_hero_caret');
    var credentialEl = document.querySelector('.d2c_hero_credential');
    var bodyEl = document.querySelector('.d2c_hero_body');
    var metadataEl = document.querySelector('.d2c_hero_metadata');
    var btnPrimary = document.querySelector('.d2c_hero_btn_primary');
    var btnGhost = document.querySelector('.d2c_hero_btn_ghost');
    var hasScramble = typeof ScrambleTextPlugin !== 'undefined';
    if (hasScramble && typeof gsap !== 'undefined') gsap.registerPlugin(ScrambleTextPlugin);

    function runBootSequence() {
        if (!bootEl || !mainEl) return;
        var lines = bootEl.querySelectorAll('.d2c_hero_boot_line');
        var idx = 0;
        function showNext() {
            if (idx < lines.length) {
                lines[idx].classList.add('d2c_hero_boot_visible');
                idx++;
                setTimeout(showNext, 220);
            } else {
                bootEl.classList.add('d2c_hero_boot_done');
                setTimeout(function() {
                    bootEl.hidden = true;
                    mainEl.hidden = false;
                    runMasterHeroTimeline();
                }, 120);
            }
        }
        setTimeout(showNext, 0);
    }

    function runMasterHeroTimeline() {
        if (typeof gsap === 'undefined') return;

        if (headlineEl) headlineEl.textContent = '';

        var tl = gsap.timeline();

        // Step 1: Scramble (4s) – slower pace for readability
        var scrambleDuration = 4;
        if (hasScramble && headlineEl) {
            tl.to(headlineEl, {
                duration: scrambleDuration,
                scrambleText: {
                    text: '[PIVOT_INITIALISED: PHYSICAL_SECURITY -> DIGITAL_DEFENCE]',
                    chars: 'upperCase',
                    revealDelay: 0.9,
                    speed: 0.16,
                    tweenLength: true
                },
                ease: 'power2.inOut'
            }, 0);
        } else if (headlineEl) {
            tl.set(headlineEl, { textContent: '[PIVOT_INITIALISED: PHYSICAL_SECURITY -> DIGITAL_DEFENCE]' }, 0);
        }
        if (caretEl) tl.set(caretEl, { opacity: 1 }, scrambleDuration);
        tl.call(function() {
            if (caretEl) caretEl.classList.add('d2c_hero_caret--blink');
        }, null, scrambleDuration);

        // Step 2: Credentials – line reveal (matched to slower pace)
        var createLineReveal = window.d2c_createLineReveal;
        if (credentialEl && createLineReveal) {
            tl.set(credentialEl, { visibility: 'visible', opacity: 1 }, '+=0');
            createLineReveal(credentialEl, {
                addTo: tl,
                position: '-=0',
                y: 20,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power4.out'
            });
        }

        // Step 3: Body text – SplitText line reveal when available, else createLineReveal (matched pace)
        tl.addLabel('bodyStart', '+=0');
        if (bodyEl) {
            tl.set(bodyEl, { visibility: 'visible', opacity: 1 }, 'bodyStart');
            if (typeof SplitText !== 'undefined') {
                gsap.registerPlugin(SplitText);
                var split = SplitText.create(bodyEl, { type: 'lines' });
                tl.from(split.lines, { y: 20, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'power4.out' }, 'bodyStart');
            } else if (createLineReveal) {
                createLineReveal(bodyEl, {
                    addTo: tl,
                    position: 'bodyStart',
                    y: 20,
                    duration: 1.3,
                    stagger: 0.12,
                    ease: 'power4.out'
                });
            }
        }

        // Step 4: Buttons – trigger when body is ~50% revealed (matched to slower pace)
        if (btnPrimary && btnGhost) {
            tl.set([btnPrimary, btnGhost], { visibility: 'visible', opacity: 1 }, 'bodyStart+=0.8');
            tl.fromTo(btnPrimary, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'bounce.out' }, 'bodyStart+=0.8');
            tl.fromTo(btnGhost, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.7, ease: 'bounce.out' }, 'bodyStart+=0.8');
        }

        // Metadata – after body (matched pace)
        if (metadataEl) {
            tl.set(metadataEl, { visibility: 'visible', opacity: 1 }, '+=0.4');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(runBootSequence, 600);
        });
    } else {
        setTimeout(runBootSequence, 600);
    }
})();

/* Live system health log – footer ticker simulating real-time telemetry */
(function() {
    var logs = [
        '[OK] FIREWALL_INTEGRITY_CHECK: 100%',
        '[INFO] LISTENING_ON_PORT: 443',
        '[OK] ENCRYPTION_LAYER: AES-256_ACTIVE',
        '[SUCCESS] SECURE_NODE_INITIALISED',
        '[INFO] ACCESS_LOG_UPDATED: SYDNEY_CBD_NODE',
        '[OK] CSP_HEADERS_VERIFIED'
    ];
    var container = document.getElementById('d2c_log_container');
    if (!container) return;

    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function getTimestamp() {
        var d = new Date();
        return pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
    }

    function appendLog() {
        var msg = logs[Math.floor(Math.random() * logs.length)];
        var line = document.createElement('div');
        line.className = 'd2c_log_line';
        line.innerHTML = '<span class="d2c_log_timestamp">[' + getTimestamp() + ']</span><span class="d2c_log_message">' + msg + '</span>';
        container.appendChild(line);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }

    function scheduleNext() {
        var delay = 3000 + Math.random() * 2000;
        setTimeout(function() {
            appendLog();
            scheduleNext();
        }, delay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            appendLog();
            scheduleNext();
        });
    } else {
        appendLog();
        scheduleNext();
    }
})();

/* Preloader – terminal boot sequence before main content renders */
window.addEventListener('load', function() {
    var preloader = document.querySelector('.preloader');
    if (preloader) preloader.classList.add('hide');
});

/* Scroll-to-top button – visibility toggled on scroll position */
function scrollFunction() {
    var scrollBtn = document.getElementById('scrollBtn');
    if (!scrollBtn) return;
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
}
window.onscroll = scrollFunction;

/* ==========================================================================
   initCyberInteractions – Suite of high-end interactive features
   [A] Classified Redaction | [B] Forensic Loupe | [C] Telemetry Breadcrumbs | [D] Attack Surface
   ========================================================================== */
function initCyberInteractions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);

    var scrollTriggerStart = 'top 85%';

    /* [A] Classified Redaction – wrap inner text in span.redacted-wrapper, bar inside span */
    function injectRedaction() {
        var paragraphs = document.querySelectorAll('#about p');
        paragraphs.forEach(function(p) {
            if (p.querySelector('.redacted-wrapper')) return;
            var wrapper = document.createElement('span');
            wrapper.className = 'redacted-wrapper';
            var bar = document.createElement('div');
            bar.className = 'redaction-bar';
            while (p.firstChild) {
                wrapper.appendChild(p.firstChild);
            }
            wrapper.insertBefore(bar, wrapper.firstChild);
            p.appendChild(wrapper);
        });
    }
    injectRedaction();

    /* [A2] Contact/Comms redaction – wrap email and resume links in redacted-wrapper */
    function injectCommsRedaction() {
        var targets = document.querySelectorAll('.d2c_comms_redact_target');
        targets.forEach(function(link) {
            if (!link || !link.parentNode || link.parentNode.classList.contains('redacted-wrapper')) return;
            var wrapper = document.createElement('span');
            wrapper.className = 'redacted-wrapper';
            var bar = document.createElement('div');
            bar.className = 'redaction-bar';
            link.parentNode.replaceChild(wrapper, link);
            wrapper.appendChild(bar);
            wrapper.appendChild(link);
        });
    }
    injectCommsRedaction();

    /* GSAP redaction reveal – slower, deliberate; redacted state visible before reveal */
    gsap.utils.toArray('.redaction-bar').forEach(function(bar) {
        if (!bar) return;
        gsap.to(bar, {
            scaleX: 0,
            duration: 2.5,
            delay: 0.6,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
                markers: false,
                toggleActions: 'play none none none'
            }
        });
    });

    /* [B] Forensic Loupe – digital investigation HUD, 2.5x enhance (1024px+ only, saves battery/CPU on mobile) */
    var loupeZone = document.querySelector('.d2c_loupe_zone');
    var aboutImg = document.getElementById('d2c_about_img');
    if (loupeZone && aboutImg && window.matchMedia('(min-width: 1024px)').matches) {
        var loupe = document.createElement('div');
        loupe.className = 'd2c_loupe';
        var loupeBg = document.createElement('div');
        loupeBg.className = 'd2c_loupe_bg';
        var loupeScanlines = document.createElement('div');
        loupeScanlines.className = 'd2c_loupe_scanlines';
        var loupeCrosshair = document.createElement('div');
        loupeCrosshair.className = 'd2c_loupe_crosshair';
        var loupeLabel = document.createElement('span');
        loupeLabel.className = 'd2c_loupe_label';
        loupeLabel.textContent = '[ANALYSING_ARTIFACT: 4X_ENHANCE]';
        loupe.appendChild(loupeBg);
        loupe.appendChild(loupeScanlines);
        loupe.appendChild(loupeCrosshair);
        loupe.appendChild(loupeLabel);
        document.body.appendChild(loupe);
        var imgSrc = aboutImg.src;
        var zoom = 2.5;

        loupeZone.addEventListener('mouseenter', function() {
            loupe.classList.add('d2c_loupe_active');
            loupeBg.style.backgroundImage = 'url(' + imgSrc + ')';
        });
        loupeZone.addEventListener('mouseleave', function() {
            loupe.classList.remove('d2c_loupe_active');
        });
        loupeZone.addEventListener('mousemove', function(e) {
            var r = loupeZone.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            loupe.style.left = (e.clientX - 75) + 'px';
            loupe.style.top = (e.clientY - 75) + 'px';
            loupeBg.style.width = (150 * zoom) + 'px';
            loupeBg.style.height = (150 * zoom) + 'px';
            loupeBg.style.backgroundSize = (r.width * zoom) + 'px ' + (r.height * zoom) + 'px';
            loupeBg.style.backgroundPosition = (-x * zoom + 75) + 'px ' + (-y * zoom + 75) + 'px';
        });
    }

    /* [C] Telemetry Breadcrumbs – vertical sidebar, section status */
    var telemetrySidebar = document.getElementById('d2c_telemetry_sidebar');
    var progressBar = document.getElementById('d2c_scroll_progress');
    if (telemetrySidebar) {
        telemetrySidebar.classList.add('d2c_telemetry_active');
        if (progressBar) progressBar.classList.add('d2c_progress_hidden');
        var homeStatus = telemetrySidebar.querySelector('[data-section="home"]');
        if (homeStatus) homeStatus.classList.add('d2c_telemetry_current');
        var sections = ['home', 'about', 'experience', 'project'];
        sections.forEach(function(id) {
            var section = document.getElementById(id);
            if (!section) return;
            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: function() {
                    telemetrySidebar.querySelectorAll('.d2c_telemetry_status').forEach(function(s) {
                        s.classList.remove('d2c_telemetry_current');
                        if (s.dataset.section === id) s.classList.add('d2c_telemetry_current');
                    });
                },
                onEnterBack: function() {
                    telemetrySidebar.querySelectorAll('.d2c_telemetry_status').forEach(function(s) {
                        s.classList.remove('d2c_telemetry_current');
                        if (s.dataset.section === id) s.classList.add('d2c_telemetry_current');
                    });
                }
            });
        });
    }

    /* [D] Attack Surface – canvas nodes, mouse lines, 1024px+ only (disabled on mobile to save battery/CPU) */
    var canvas = document.getElementById('attackSurface');
    if (canvas && window.matchMedia('(min-width: 1024px)').matches) {
        canvas.classList.add('d2c_attack_surface_visible');
        var ctx = canvas.getContext('2d');
        var nodes = [];
        var nodeCount = 60 + Math.floor(Math.random() * 21);
        var mouse = { x: -999, y: -999 };
        var heroRect = { w: 0, h: 0 };

        function resize() {
            var hero = document.querySelector('.d2c_hero_wrapper');
            if (!hero) return;
            heroRect.w = hero.offsetWidth;
            heroRect.h = hero.offsetHeight;
            canvas.width = heroRect.w;
            canvas.height = heroRect.h;
            if (nodes.length === 0) {
                for (var i = 0; i < nodeCount; i++) {
                    nodes.push({
                        x: Math.random() * heroRect.w,
                        y: Math.random() * heroRect.h,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: (Math.random() - 0.5) * 0.3
                    });
                }
            }
        }
        function debounce(fn, ms) {
            var t;
            return function() {
                clearTimeout(t);
                t = setTimeout(fn, ms);
            };
        }
        var heroWrapper = document.querySelector('.d2c_hero_wrapper');
        if (heroWrapper) {
            heroWrapper.addEventListener('mousemove', function(e) {
                var r = canvas.getBoundingClientRect();
                mouse.x = e.clientX - r.left;
                mouse.y = e.clientY - r.top;
            });
            heroWrapper.addEventListener('mouseleave', function() {
                mouse.x = -999;
                mouse.y = -999;
            });
        }
        resize();
        window.addEventListener('resize', debounce(resize, 150));

        function dist(a, b) { return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(function(n) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > heroRect.w) n.vx *= -1;
                if (n.y < 0 || n.y > heroRect.h) n.vy *= -1;
                ctx.fillStyle = '#00FFFF';
                ctx.fillRect(n.x - 1, n.y - 1, 2, 2);
                if (mouse.x > -900 && dist(n, mouse) < 150) {
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
}

window.addEventListener('load', function() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof initCyberInteractions === 'function') {
        initCyberInteractions();
    }
});

