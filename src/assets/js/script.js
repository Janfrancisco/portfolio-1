document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // ELEMENTOS DO DOM
  // =========================================================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const contactForm = document.getElementById("contact-form");
  const header = document.querySelector("header");
  const allLinks = document.querySelectorAll("[data-nav-link]");
  const sections = document.querySelectorAll("section[id]");

  // Estado de navegação
  let isNavigating = false;
  let lastNavigatedPage = null;

  // =========================================================================
  // MENU MOBILE
  // =========================================================================
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      // Bloquear scroll spy temporariamente durante toggle do menu
      const wasNavigating = isNavigating;
      isNavigating = true;

      if (mobileMenu) mobileMenu.classList.toggle("hidden");
      if (menuIcon) menuIcon.classList.toggle("hidden");
      if (closeIcon) closeIcon.classList.toggle("hidden");

      // Liberar após transição do menu
      setTimeout(() => {
        // Só liberar se não estava em navegação antes
        if (!wasNavigating) {
          isNavigating = false;
        }
      }, 400);
    });
  }

  function closeMobileMenu() {
    if (!mobileMenu || mobileMenu.classList.contains("hidden")) return;

    // Bloquear scroll spy ao fechar menu
    const wasNavigating = isNavigating;
    isNavigating = true;

    mobileMenu.classList.add("hidden");
    if (menuIcon) menuIcon.classList.remove("hidden");
    if (closeIcon) closeIcon.classList.add("hidden");

    // Liberar após transição
    setTimeout(() => {
      if (!wasNavigating) {
        isNavigating = false;
      }
    }, 400);
  }

  // =========================================================================
  // FORMULÁRIO DE CONTATO
  // =========================================================================
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      contactForm.reset();
    });
  }

  // =========================================================================
  // MARCAR LINK ATIVO
  // =========================================================================
  function setActivePage(page) {
    allLinks.forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // =========================================================================
  // EASING - Começa rápido e termina suave
  // =========================================================================
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // =========================================================================
  // SCROLL SUAVE
  // =========================================================================
  function smoothScrollTo(targetY, duration = 800) {
    return new Promise((resolve) => {
      const startPos = window.scrollY;
      const distance = targetY - startPos;

      if (Math.abs(distance) < 3) {
        window.scrollTo(0, targetY);
        resolve();
        return;
      }

      let startTime = null;

      function frame(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        window.scrollTo(0, Math.round(startPos + distance * eased));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  // =========================================================================
  // NAVEGAR PARA SEÇÃO
  // =========================================================================
  async function navigateToSection(sectionId, updateHistory = true) {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`Seção não encontrada: ${sectionId}`);
      return;
    }

    // Bloquear scroll spy
    isNavigating = true;
    lastNavigatedPage = sectionId;

    // Fechar menu mobile primeiro
    const wasMenuOpen = mobileMenu && !mobileMenu.classList.contains("hidden");
    closeMobileMenu();

    // Aguardar menu fechar SOMENTE se estava aberto
    if (wasMenuOpen) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    // Marcar link ativo IMEDIATAMENTE
    setActivePage(sectionId);

    // Atualizar URL
    if (updateHistory) {
      history.pushState(null, "", "/" + sectionId);
    }

    // Calcular posição
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY =
      section.getBoundingClientRect().top + window.scrollY - headerHeight;

    // Executar scroll
    await smoothScrollTo(targetY, 800);

    // Manter bloqueio por mais tempo para garantir estabilidade
    setTimeout(() => {
      isNavigating = false;
      // Reconfirmar a página navegada
      if (lastNavigatedPage === sectionId) {
        setActivePage(sectionId);
      }
    }, 600);
  }

  // =========================================================================
  // SCROLL SPY
  // =========================================================================
  function updateActiveSection() {
    // NUNCA executar durante navegação programática
    if (isNavigating) return;

    const viewportCenter = window.innerHeight / 2;
    let closestSection = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });

    if (closestSection) {
      const id = closestSection.id;
      lastNavigatedPage = id;
      setActivePage(id);
      history.replaceState(null, "", "/" + id);
    }
  }

  // =========================================================================
  // LISTENER DE SCROLL
  // =========================================================================
  let scrollTimer = null;
  window.addEventListener(
    "scroll",
    () => {
      if (isNavigating) return;

      // Debounce para evitar muitas chamadas
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        updateActiveSection();
      }, 50);
    },
    { passive: true }
  );

  // =========================================================================
  // CLICK NOS LINKS
  // =========================================================================
  allLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const page = link.dataset.page;
      if (!page) return;

      // Verificar se a seção existe
      const section = document.getElementById(page);
      if (!section) {
        console.warn(`Seção não encontrada: ${page}`);
        return;
      }

      navigateToSection(page, true);
    });
  });

  // =========================================================================
  // BOTÃO VOLTAR/AVANÇAR
  // =========================================================================
  window.addEventListener("popstate", () => {
    const path = window.location.pathname.replace("/", "") || "home";
    navigateToSection(path, false);
  });

  // =========================================================================
  // INICIALIZAÇÃO
  // =========================================================================
  function initialize() {
    // Garantir que scroll spy está desativado inicialmente
    isNavigating = true;

    let page = window.location.pathname.replace("/", "") || "home";
    const validPages = Array.from(sections).map((s) => s.id);

    if (!validPages.includes(page)) {
      page = "home";
    }

    lastNavigatedPage = page;

    // Marcar link ativo
    setActivePage(page);

    // Se não for home, navegar
    if (page !== "home") {
      setTimeout(() => {
        navigateToSection(page, false);
      }, 200);
    } else {
      // Se for home, apenas liberar scroll spy
      setTimeout(() => {
        isNavigating = false;
      }, 300);
    }
  }

  // Aguardar DOM completamente carregado + imagens
  if (document.readyState === "complete") {
    initialize();
  } else {
    window.addEventListener("load", () => {
      setTimeout(initialize, 100);
    });
  }
});
