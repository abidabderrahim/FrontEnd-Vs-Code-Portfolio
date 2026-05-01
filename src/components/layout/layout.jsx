import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./layout.module.css";
import LoginModal from "../login/loginModal";
import RegisterModal from "../register/registerModal";
import ForgotModal from "../forgot/forgotModal";
import { IoMdInformationCircleOutline, IoMdClose } from "react-icons/io";
import { BiAdjust, BiDownload, BiChevronRight } from "react-icons/bi";
import { RiBubbleChartFill, RiTranslateAi2 } from "react-icons/ri";
import { GrNetworkDrive, GrContactInfo } from "react-icons/gr";

export default function Layout({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [lineCount, setLineCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [validIndexItems, setValidIndexItems] = useState([]);
  const [portfolioData, setPortfolioData] = useState({
    layout: {
      topbar: { message: "", status: "" },
      leftbar: {
        profile: {},
        job: [],
        experience: [],
        languages: [],
        contact: { email: "", phone: "" },
        resumeLink: "",
      },
      footerbar: { location: "", links: {} },
    },
  });
  const [openSections, setOpenSections] = useState({
    job: true,
    experience: false,
    languages: false,
    contact: false,
    resume: false,
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleNavbar = () => setMobileNavOpen((prev) => !prev);
  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  // Fetch config data
  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => setPortfolioData(data.portfolio_config))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // theme
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Update local time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Africa/Casablanca",
      };
      setLocalTime(now.toLocaleTimeString("en-GB", options));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const contentRef = useRef(null);
  const lineSidebarRef = useRef(null);
  const thumbRef = useRef(null);
  const LINE_HEIGHT = 20;

  // Update line numbers
  useEffect(() => {
    const updateLines = () => {
      const container = contentRef.current;
      if (!container) return;
      const blocks = Array.from(container.children);
      const style = window.getComputedStyle(container);
      const lineHeight = parseFloat(style.lineHeight) || LINE_HEIGHT;
      let totalLines = 0;
      blocks.forEach((block) => {
        totalLines += Math.ceil(
          block.getBoundingClientRect().height / lineHeight
        );
      });
      setLineCount(totalLines);
    };
    updateLines();
    const observer = new MutationObserver(updateLines);
    if (contentRef.current)
      observer.observe(contentRef.current, { childList: true, subtree: true });
    window.addEventListener("resize", updateLines);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLines);
    };
  }, [children]);

  // IntersectionObserver for active sections
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => sections.forEach((sec) => observer.unobserve(sec));
  }, [children]);

  // Page index config
  const location = useLocation();
  const INDEX_CONFIG = {
    "/": [
      { id: "my-work", label: "my work" },
      { id: "my-services", label: "my services" },
      { id: "pricing", label: "pricing" },
      { id: "testimonials", label: "testimonials" },
      { id: "how-i-work", label: "how i work" },
      { id: "blog", label: "blog" },
    ],
    "/contact": [
      { id: "connect", label: "connect" },
      { id: "media", label: "media" },
    ],
    "/about": [
      { id: "profile", label: "profile" },
      { id: "experience", label: "experience" },
      { id: "education", label: "education" },
      { id: "skills", label: "skills" },
      { id: "stack", label: "stack" },
    ],
    "/blog": [
      { id: "blog", label: "blog" },
      { id: "subscribe", label: "subscribe" },
    ],
    "/projects": [{ id: "projects", label: "projects" }],
    "/projects/:slug": [
      { id: "project", label: "project" },
      { id: "testimonial", label: "testimonial" },
      { id: "add-testimonial", label: "add testimonial" },
    ],
    "/blog/:slug": [
      { id: "article", label: "article" },
      { id: "comment", label: "comment" },
    ],
    "/dashboard": [
      { id: "status", label: "status" },
      { id: "articles", label: "articles" },
      { id: "projects", label: "projects" },
      { id: "users-management", label: "users" },
      { id: "subscribers-management", label: "subscribers" },
      { id: "testimonials-management", label: "testimonails" },
    ],
  };

  // index for all pages
  const indexItems = useMemo(() => {
    const path = location.pathname;

    if (INDEX_CONFIG[path]) return INDEX_CONFIG[path];

    if (path.startsWith("/blog/")) return INDEX_CONFIG["/blog/:slug"];

    if (path.startsWith("/projects/")) return INDEX_CONFIG["/projects/:slug"];

    return [];
  }, [location.pathname]);

  // hide index
  useEffect(() => {
    if (!children) {
      setValidIndexItems([]);
      return;
    }
    const updated = indexItems.filter((item) => {
      const el = document.getElementById(item.id);
      return el && el.textContent.trim().length > 0;
    });
    setValidIndexItems(updated);
  }, [children, indexItems]);

  // scroll async
  useEffect(() => {
    const main = contentRef.current;
    const linesSidebar = lineSidebarRef.current;

    if (!main || !linesSidebar) return;

    const handleScroll = () => {
      // Sync the scrollTop of the sidebar with the main content
      linesSidebar.scrollTop = main.scrollTop;
    };

    main.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initialize positions
    handleScroll();

    return () => {
      main.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* layout */}
      <div className={styles.layout}>
        {/* Topbar */}
        <div className={styles.topBar}>
          <div className={styles.topleftBar}>
            <button
              className={styles.toggleSidebarBtn}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <IoMdInformationCircleOutline className={styles.toggleIcon} />
            </button>
            <div className={styles.welcomeMessage}>
              <span className={styles.welcome}>
                {portfolioData?.layout?.topbar?.message || "Loading..."}
              </span>
            </div>
          </div>
          <div className={styles.toprightBar}>
            <div className={styles.status}>
              <div className={styles.dot}></div>
              <span className={styles.text}>
                {portfolioData?.layout?.topbar?.status || "Loading..."}
              </span>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className={styles.content}>
          {/* Left Sidebar */}
          <aside className={styles.sidebarLeft}>
            <div className={styles.profile}>
              <div className={styles.avatar}>
                <img
                  src={
                    portfolioData?.layout?.leftbar?.profile?.image ||
                    "/Images/default.webp"
                  }
                  alt="Profile"
                  className={styles.imageProfile}
                />
                <span className={styles.name}>
                  {portfolioData?.layout?.leftbar?.profile?.name ||
                    "Loading..."}
                </span>
              </div>
              <div className={styles.profileInfo}>
                {["job", "experience", "languages"].map((section) => (
                  <div className={styles.infoBlock} key={section}>
                    <div className={styles.infoTitle}>
                      {
                        {
                          job: <GrNetworkDrive className={styles.infoIcon} />,
                          experience: (
                            <RiBubbleChartFill className={styles.infoIcon} />
                          ),
                          languages: (
                            <RiTranslateAi2 className={styles.infoIcon} />
                          ),
                        }[section]
                      }
                      <span>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    </div>
                    <ul className={styles.infoList}>
                      {(portfolioData?.layout?.leftbar?.[section] || []).map(
                        (item, idx) => (
                          <li key={idx}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
                {/* CONTACT */}
                <div className={styles.infoBlock}>
                  <div className={styles.infoTitle}>
                    <GrContactInfo className={styles.infoIcon} />
                    <span>Contact</span>
                  </div>
                  <ul className={styles.infoList}>
                    <li>
                      <a
                        href={`mailto:${portfolioData?.layout?.leftbar?.contact?.email || ""
                          }`}
                      >
                        {portfolioData?.layout?.leftbar?.contact?.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${portfolioData?.layout?.leftbar?.contact?.phone || ""
                          }`}
                      >
                        {portfolioData?.layout?.leftbar?.contact?.phone}
                      </a>
                    </li>
                  </ul>
                </div>
                <a
                  className={styles.resumeBtn}
                  href={portfolioData?.layout?.leftbar?.resumeLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.resumeText}>Download Resume</span>
                  <span className={styles.resumeIcon}>
                    <BiDownload />
                  </span>
                </a>
              </div>
            </div>
            <div className={styles.workwithMe}>
              <a href="/contact" className={styles.contactMe}>
                <BiChevronRight className={styles.icon} /> let's work together
              </a>
            </div>
          </aside>
          {/* Content Wrapper */}
          <div className={styles.contentWrapper}>
            {/* Navbar */}
            <nav className={styles.nav}>
              <div className={styles.sep}></div>
              <ul className={styles.navLinks}>
                {["/", "/about", "/blog", "/contact", "/projects"].map(
                  (path, idx) => (
                    <li key={idx} className={styles.navItem}>
                      <NavLink
                        to={path}
                        end
                        className={({ isActive }) =>
                          `${styles.listLink} ${isActive ? styles.active : ""}`
                        }
                      >
                        {path === "/" ? "Home" : path.slice(1)}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
              <div className={styles.navRight}>
                <div className={styles.buttons}>
                  <button
                    className={styles.login}
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsRegisterOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button className={styles.theme} onClick={toggleTheme}>
                    <BiAdjust className={styles.icon} />
                  </button>
                </div>
                <button
                  className={styles.toggleNavBtn}
                  onClick={toggleNavbar}
                  aria-label="Toggle navigation"
                >
                  <div className={styles.menuHamburger}>
                    <span />
                    <span />
                    <span />
                  </div>
                </button>
              </div>
            </nav>
            {/* Main Content + Line Sidebar */}
            <div className={styles.barcontentWrapper}>
              {/* Lines Sidebar */}
              <aside ref={lineSidebarRef} className={styles.sidelinesBar}>
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className={styles.lineNumber}>
                    {i + 1}
                  </div>
                ))}
              </aside>
              {/* Main Content */}
              <div className={styles.mainContentWrapper}>
                <div
                  ref={thumbRef}
                  className={`${styles.scrollIndicator} ${scrolling ? styles.visible : ""
                    }`}
                />
                <main ref={contentRef} className={styles.mainContent}>
                  {children}
                </main>
              </div>
              {/* Right Sidebar / Page Index */}
              <aside className={styles.sidebarRight}>
                <div className={styles.indexTitle}>Page index</div>
                {validIndexItems.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.indexLink} ${activeSection === item.id ? styles.active : ""
                      }`}
                    onClick={() => {
                      const section = document.getElementById(item.id);
                      if (section)
                        section.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </aside>
            </div>
          </div>
        </div>
        {/* Footerbar */}
        <footer className={styles.footerBar}>
          <div className={styles.location}>
            <span className={styles.myLocation}>
              {portfolioData?.layout?.footerbar?.location || "Loading..."}
              <span className={styles.sep}></span>
              {localTime}
            </span>
          </div>
          <div className={styles.mediaLinks}>
            <a
              href={portfolioData?.layout?.footerbar?.links?.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              .In
            </a>
            <a
              href={portfolioData?.layout?.footerbar?.links?.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              .Li
            </a>
            <a
              href={portfolioData?.layout?.footerbar?.links?.twitter || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              .X
            </a>
            <a
              href={portfolioData?.layout?.footerbar?.links?.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              .Gi
            </a>
          </div>
        </footer>
        {/* Side Menu */}
        <menu
          className={`${styles.sidebarLeftmenu} ${sidebarOpen ? styles.openMenu : ""
            }`}
        >
          <div className={styles.close}>
            <button className={styles.closeMenu} onClick={toggleSidebar}>
              <IoMdClose className={styles.icon} />
            </button>
          </div>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <img
                src={
                  portfolioData?.layout?.leftbar?.profile?.image ||
                  "/Images/default.webp"
                }
                alt="Profile"
                className={styles.imageProfile}
              />
              <span className={styles.name}>
                {portfolioData?.layout?.leftbar?.profile?.name || "Loading..."}
              </span>
            </div>
            <div className={styles.profileInfo}>
              {/* JOB TITLE */}
              <div className={styles.infoBlock}>
                <div className={styles.infoTitle}>
                  <GrNetworkDrive className={styles.infoIcon} />
                  <span>My Job</span>
                </div>
                <ul className={styles.infoList}>
                  {portfolioData.layout.leftbar.job.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* EXPERIENCE */}
              <div className={styles.infoBlock}>
                <div className={styles.infoTitle}>
                  <RiBubbleChartFill className={styles.infoIcon} />
                  <span>Experience</span>
                </div>
                <ul className={styles.infoList}>
                  {portfolioData.layout.leftbar.experience.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* LANGUAGES */}
              <div className={styles.infoBlock}>
                <div className={styles.infoTitle}>
                  <RiTranslateAi2 className={styles.infoIcon} />
                  <span>Languages</span>
                </div>
                <ul className={styles.infoList}>
                  {portfolioData.layout.leftbar.languages.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* CONTACT */}
              <div className={styles.infoBlock}>
                <div className={styles.infoTitle}>
                  <GrContactInfo className={styles.infoIcon} />
                  <span>Contact</span>
                </div>
                <ul className={styles.infoList}>
                  <li>
                    <a
                      href={`mailto:${portfolioData.layout.leftbar.contact.email}`}
                    >
                      {portfolioData.layout.leftbar.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${portfolioData.layout.leftbar.contact.phone}`}
                    >
                      {portfolioData.layout.leftbar.contact.phone}
                    </a>
                  </li>
                </ul>
              </div>
              {/* RESUME DOWNLOAD BUTTON */}
              <a
                className={styles.resumeBtn}
                href={portfolioData.layout.leftbar.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.resumeText}>Download Resume</span>
                <span className={styles.resumeIcon}>
                  <BiDownload />
                </span>
              </a>
            </div>
          </div>
          <div className={styles.workwithMe}>
            <a href="/contact" className={styles.contactMe}>
              <BiChevronRight className={styles.icon} /> let's work together
            </a>
          </div>
        </menu>
        {sidebarOpen && (
          <div className={styles.overlay} onClick={toggleSidebar} />
        )}
        {/* Mobile Nav Menu */}
        <nav
          className={`${styles.navMenu} ${mobileNavOpen ? styles.mobileOpen : ""
            }`}
        >
          <div className={styles.close}>
            <button className={styles.closeMenu} onClick={toggleNavbar}>
              <IoMdClose className={styles.icon} />
            </button>
          </div>
          <ul className={styles.navLinks}>
            {["/", "/about", "/blog", "/contact", "/projects"].map(
              (path, idx) => (
                <NavLink
                  to={path}
                  end
                  key={idx}
                  className={({ isActive }) =>
                    `${styles.listLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={() => setMobileNavOpen(false)}
                >
                  {path === "/" ? "Home" : path.slice(1)}
                </NavLink>
              )
            )}
          </ul>
          <div className={styles.buttons}>
            <button
              className={styles.login}
              onClick={() => {
                setIsLoginOpen(true);
                setIsRegisterOpen(false);
                setMobileNavOpen(false);
              }}
            >
              Login
            </button>
            <button className={styles.theme} onClick={toggleTheme}>
              <BiAdjust className={styles.icon} />
            </button>
          </div>
        </nav>
        {mobileNavOpen && (
          <div className={styles.overlay} onClick={toggleNavbar} />
        )}
      </div>

      {/* modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        openForgot={() => {
          setIsLoginOpen(false);
          setIsForgotOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        openLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <ForgotModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
}
