(() => {
  "use strict";

  // Número oficial de WhatsApp da Garagem 1000 (DDI 55 + DDD 13 + número).
  const WHATSAPP_NUMBER = "5513997851852";

  function buildWhatsAppUrl(message) {
    const encoded = encodeURIComponent(message);
    if (WHATSAPP_NUMBER) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
  }

  // Menu mobile acessível (drawer + backdrop + tecla Escape + fechamento ao tocar em link)
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navDrawer = document.getElementById("mobile-nav-drawer");
  const drawerBackdrop = document.getElementById("mobile-drawer-backdrop");

  function setMenuOpen(isOpen) {
    if (!menuToggle || !navDrawer || !drawerBackdrop) {
      return;
    }
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    navDrawer.hidden = !isOpen;
    drawerBackdrop.hidden = !isOpen;
    document.body.classList.toggle("menu-open", isOpen);
  }

  if (menuToggle && navDrawer && drawerBackdrop) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!expanded);
    });

    drawerBackdrop.addEventListener("click", () => setMenuOpen(false));

    navDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
      }
    });
  }

  // Construtor rápido de mensagem para WhatsApp
  const eventTypeInput = document.getElementById("builder-event-type");
  const cityDateInput = document.getElementById("builder-city-date");
  const guestsInput = document.getElementById("builder-guests");
  const previewEl = document.getElementById("builder-preview");
  const sendBtn = document.getElementById("builder-send");
  const copyBtn = document.getElementById("builder-copy");
  const statusEl = document.getElementById("builder-status");

  if (!eventTypeInput || !cityDateInput || !guestsInput || !previewEl || !sendBtn || !copyBtn) {
    return;
  }

  function composeMessage() {
    const eventType = eventTypeInput.value.trim() || "evento";
    const cityDate = cityDateInput.value.trim();
    const guests = guestsInput.value.trim();

    const parts = [
      `Olá, equipe da Garagem 1000! Gostaria de consultar disponibilidade e orçamento para um show (${eventType}).`,
    ];

    if (cityDate) {
      parts.push(`Cidade / Data: ${cityDate}.`);
    }

    if (guests) {
      parts.push(`Público estimado: ${guests}.`);
    }

    parts.push("Aguardo o retorno!");
    return parts.join("\n");
  }

  function updateBuilder() {
    const message = composeMessage();
    previewEl.textContent = message;
    sendBtn.href = buildWhatsAppUrl(message);
  }

  eventTypeInput.addEventListener("change", updateBuilder);
  cityDateInput.addEventListener("input", updateBuilder);
  guestsInput.addEventListener("input", updateBuilder);

  copyBtn.addEventListener("click", async () => {
    const message = composeMessage();
    try {
      await navigator.clipboard.writeText(message);
      if (statusEl) {
        statusEl.textContent = "Mensagem copiada para a área de transferência!";
      }
    } catch {
      if (statusEl) {
        statusEl.textContent = "Não foi possível copiar automaticamente. Use o botão de WhatsApp acima.";
      }
    }
  });

  // Atualiza links estáticos de WhatsApp caso WHATSAPP_NUMBER seja configurado
  if (WHATSAPP_NUMBER) {
    document.querySelectorAll("[data-whatsapp-text]").forEach((link) => {
      const text = link.getAttribute("data-whatsapp-text") || "";
      link.setAttribute("href", buildWhatsAppUrl(text));
    });
  }

  updateBuilder();
})();
