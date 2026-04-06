document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const root = document.documentElement;
const stageSteps = [...document.querySelectorAll(".stage-step")];
const stageIndex = document.querySelector("#stage-index");
const stageTitle = document.querySelector("#stage-title");
const stageSummary = document.querySelector("#stage-summary");
const stagePoints = document.querySelector("#stage-points");
const signalDots = [...document.querySelectorAll(".signal-dot")];
const parallaxPanels = [...document.querySelectorAll("[data-parallax]")];

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -10% 0px",
  },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const updateStagePanel = (step) => {
  stageSteps.forEach((item) => item.classList.toggle("is-active", item === step));

  if (!stageIndex || !stageTitle || !stageSummary || !stagePoints) {
    return;
  }

  stageIndex.textContent = step.dataset.stage || "01";
  stageTitle.textContent = step.dataset.title || "";
  stageSummary.textContent = step.dataset.summary || "";

  const points = [
    step.dataset.pointA,
    step.dataset.pointB,
    step.dataset.pointC,
  ].filter(Boolean);

  stagePoints.innerHTML = points.map((point) => `<li>${point}</li>`).join("");

  signalDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index < Number(step.dataset.stage || 1));
  });
};

if (stageSteps.length) {
  updateStagePanel(stageSteps[0]);

  const stageObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        updateStagePanel(visibleEntry.target);
      }
    },
    {
      threshold: [0.35, 0.6, 0.85],
      rootMargin: "-18% 0px -28% 0px",
    },
  );

  stageSteps.forEach((step) => stageObserver.observe(step));
}

const setScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(3));
};

setScrollProgress();
window.addEventListener("scroll", setScrollProgress, { passive: true });
window.addEventListener("resize", setScrollProgress);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  parallaxPanels.forEach((panel) => {
    panel.addEventListener("mousemove", (event) => {
      const bounds = panel.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
      panel.style.setProperty("--rx", x.toFixed(2));
      panel.style.setProperty("--ry", y.toFixed(2));
    });

    panel.addEventListener("mouseleave", () => {
      panel.style.setProperty("--rx", "0");
      panel.style.setProperty("--ry", "0");
    });
  });
}
