import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  FiFileText,
  FiGrid,
  FiEye,
  FiHeart,
  FiUsers,
  FiMail,
  FiMessageSquare
} from "react-icons/fi";
import PostModal from "../../components/addPost/addPostModal";
import ProjectModal from "../../components/addProject/addProjectModal";
import { BiRightArrowAlt } from "react-icons/bi";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [statusStats, setStatusStats] = useState({
    blogPosts: 0,
    projects: 0,
    views: 0,
    likes: 0,
    users: 0,
    subscribers: 0,
    testimonials: 0,
    comments: 0,
  });

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const [projects, setProjects] = useState([]);
  const [projectPage, setProjectPage] = useState(1);
  const projectsPerPage = 5;

  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  const [subscribers, setSubscribers] = useState([]);
  const [subscriberPage, setSubscriberPage] = useState(1);
  const subscribersPerPage = 5;

  const [testimonials, setTestimonials] = useState([]);
  const [testimonialPage, setTestimonialPage] = useState(1);
  const testimonialsPerPage = 5;

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    fetch("/config/portfolio_config.json")
      .then((res) => res.json())
      .then((data) => {
        const config = data.portfolio_config || {};

        const posts = config.blog?.posts || [];
        const projects = config.projects?.project || [];
        const comments = config.comments || [];
        const testimonials = config.home?.testimonials || [];
        const users = config.users || [];
        const subscribers = config.subscribers || [];

        setPosts(posts);
        setProjects(projects);
        setUsers(users);
        setSubscribers(subscribers);
        setTestimonials(testimonials);

        const postViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
        const projectViews = projects.reduce(
          (sum, p) => sum + (p.views || 0),
          0
        );

        const postLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
        const projectLikes = projects.reduce(
          (sum, p) => sum + (p.likes || 0),
          0
        );

        setStatusStats({
          blogPosts: posts.length,
          projects: projects.length,
          views: postViews + projectViews,
          likes: postLikes + projectLikes,
          users: users.length,
          subscribers: subscribers.length,
          testimonials: testimonials.length,
          comments: comments.length,
        });
      })
      .catch((err) => console.error("Error loading dashboard stats:", err));
  }, []);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return posts.slice(start, start + postsPerPage);
  }, [posts, currentPage]);

  const totalProjectPages = Math.ceil(projects.length / projectsPerPage);

  const currentProjects = useMemo(() => {
    const start = (projectPage - 1) * projectsPerPage;
    return projects.slice(start, start + projectsPerPage);
  }, [projects, projectPage]);

  const totalUserPages = Math.ceil(users.length / usersPerPage);

  const currentUsers = useMemo(() => {
    const start = (userPage - 1) * usersPerPage;
    return users.slice(start, start + usersPerPage);
  }, [users, userPage]);

  const totalSubscriberPages = Math.ceil(subscribers.length / subscribersPerPage);

  const currentSubscribers = useMemo(() => {
    const start = (subscriberPage - 1) * subscribersPerPage;
    return subscribers.slice(start, start + subscribersPerPage);
  }, [subscribers, subscriberPage]);

  const totalTestimonialPages = Math.ceil(
    testimonials.length / testimonialsPerPage
  );

  const currentTestimonials = useMemo(() => {
    const start = (testimonialPage - 1) * testimonialsPerPage;
    return testimonials.slice(start, start + testimonialsPerPage);
  }, [testimonials, testimonialPage]);

  const handleView = (post) => {
    console.log("View:", post);
    // navigate or open modal
  };

  const handleEdit = (post) => {
    console.log("Edit:", post);
    // open edit form
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);

    // fix page overflow
    if ((currentPage - 1) * postsPerPage >= updated.length) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleProjectView = (project) => {
    console.log("View project:", project);
  };

  const handleProjectEdit = (project) => {
    console.log("Edit project:", project);
  };

  const handleProjectDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);

    if ((projectPage - 1) * projectsPerPage >= updated.length) {
      setProjectPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleUserDelete = (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);

    if ((userPage - 1) * usersPerPage >= updated.length) {
      setUserPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleSubscriberDelete = (id) => {
    const confirmDelete = window.confirm("Delete this subscriber?");
    if (!confirmDelete) return;

    const updated = subscribers.filter((s) => s.id !== id);
    setSubscribers(updated);

    if ((subscriberPage - 1) * subscribersPerPage >= updated.length) {
      setSubscriberPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleTestimonialDelete = (id) => {
    const confirmDelete = window.confirm("Delete this testimonial?");
    if (!confirmDelete) return;

    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);

    if ((testimonialPage - 1) * testimonialsPerPage >= updated.length) {
      setTestimonialPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleTestimonialView = (testimonial) => {
    console.log("View testimonial:", testimonial);
    // here you can open modal OR navigate to project page
  };

  return (
    <Layout>
      {/* status */}
      <section id="status" data-section className={styles.statusData}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio status --&gt;
        </div>
        <div className={styles.status}>
          {/* Blog Posts */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiFileText />
              </span>
              <span className={styles.statLabel}>Blog Posts</span>
            </div>
            <div className={styles.statValue}>{statusStats.blogPosts}</div>
          </div>

          {/* Projects */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiGrid />
              </span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.statValue}>{statusStats.projects}</div>
          </div>

          {/* Users */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiUsers />
              </span>
              <span className={styles.statLabel}>Users</span>
            </div>
            <div className={styles.statValue}>{statusStats.users}</div>
          </div>

          {/* Subscribers */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiMail />
              </span>
              <span className={styles.statLabel}>Subscribers</span>
            </div>
            <div className={styles.statValue}>{statusStats.subscribers}</div>
          </div>

          {/* Testimonials */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiMessageSquare />
              </span>
              <span className={styles.statLabel}>Testimonials</span>
            </div>
            <div className={styles.statValue}>{statusStats.testimonials}</div>
          </div>

          {/* Comments */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiMessageSquare />
              </span>
              <span className={styles.statLabel}>Comments</span>
            </div>
            <div className={styles.statValue}>{statusStats.comments}</div>
          </div>

          {/* Views (with progress) */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiEye />
              </span>
              <span className={styles.statLabel}>Views</span>
            </div>
            <div className={styles.statValue}>{statusStats.views}</div>
            <div className={styles.progressWrapper}>
              <div
                className={styles.progress}
                style={{
                  width: `${Math.min((statusStats.views / 1500) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Likes (with progress) */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <FiHeart />
              </span>
              <span className={styles.statLabel}>Likes</span>
            </div>
            <div className={styles.statValue}>{statusStats.likes}</div>
            <div className={styles.progressWrapper}>
              <div
                className={styles.progress}
                style={{
                  width: `${Math.min((statusStats.likes / 1500) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* articles */}
      <section id="articles" data-section className={styles.articles}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio articles --&gt;
        </div>
        <button
          type="button"
          className={styles.addPostBtn}
          onClick={() => setIsPostModalOpen(true)}
        >
          <span className={styles.btnText}>Add New Post</span>
          <span className={styles.btnIcon}>
            <BiRightArrowAlt />
          </span>
        </button>
        {/* articles management */}
        <div className={styles.articlesManagement}>
          <div className={styles.tableBody}>
            {currentPosts.map((post) => (
              <div key={post.id} className={styles.row}>
                <span className={styles.title}>{post.title}</span>
                <div className={styles.postData}>
                  <span>
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span><span className={styles.rowIcon}><FiHeart /></span>{post.likes}</span>
                  <span><span className={styles.rowIcon}><FiEye /></span>{post.views}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleView(post)}>View</button>
                  <button onClick={() => handleEdit(post)}>Update</button>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? styles.activePage : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {/* projects */}
      <section id="projects" data-section className={styles.projects}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio projects --&gt;
        </div>
        <button
          type="button"
          className={styles.addProjectBtn}
          onClick={() => setIsProjectModalOpen(true)}
        >
          <span className={styles.btnText}>Add New Project</span>
          <span className={styles.btnIcon}>
            <BiRightArrowAlt />
          </span>
        </button>
        {/* projects management */}
        <div className={styles.articlesManagement}>
          <div className={styles.tableBody}>
            {currentProjects.map((project) => (
              <div key={project.id} className={styles.row}>
                <span className={styles.title}>{project.title}</span>

                <div className={styles.postData}>
                  <span>
                    {project.category || "Project"}
                  </span>

                  <span>
                    <span className={styles.rowIcon}><FiHeart /></span>
                    {project.likes || 0}
                  </span>

                  <span>
                    <span className={styles.rowIcon}><FiEye /></span>
                    {project.views || 0}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button onClick={() => handleProjectView(project)}>View</button>
                  <button onClick={() => handleProjectEdit(project)}>Update</button>
                  <button onClick={() => handleProjectDelete(project.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => setProjectPage((prev) => Math.max(prev - 1, 1))}
              disabled={projectPage === 1}
            >
              Prev
            </button>

            {[...Array(totalProjectPages)].map((_, index) => (
              <button
                key={index}
                className={projectPage === index + 1 ? styles.activePage : ""}
                onClick={() => setProjectPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setProjectPage((prev) =>
                  Math.min(prev + 1, totalProjectPages)
                )
              }
              disabled={projectPage === totalProjectPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {/* users */}
      <section id="users-management" data-section className={styles.users}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio users --&gt;
        </div>
        {/* users management */}
        <div className={styles.usersManagement}>
          <div className={styles.tableBody}>
            {currentUsers.map((user) => (
              <div key={user.id} className={styles.row}>
                <span className={styles.title}>{user.name}</span>

                <div className={styles.userData}>
                  <span>
                    {user.email}
                  </span>

                  <span>
                    {new Date(user.date).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() => handleUserDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
              disabled={userPage === 1}
            >
              Prev
            </button>

            {[...Array(totalUserPages)].map((_, index) => (
              <button
                key={index}
                className={userPage === index + 1 ? styles.activePage : ""}
                onClick={() => setUserPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setUserPage((prev) =>
                  Math.min(prev + 1, totalUserPages)
                )
              }
              disabled={userPage === totalUserPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {/* subscribers */}
      <section id="subscribers-management" data-section className={styles.subscribers}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio subscribers --&gt;
        </div>
        {/* subscribers management */}
        <div className={styles.subscriberManagement}>
          <div className={styles.tableBody}>
            {currentSubscribers.map((sub) => (
              <div key={sub.id} className={styles.row}>
                <span className={styles.title}>{sub.email}</span>

                <div className={styles.userData}>
                  <span>
                    {new Date(sub.date).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() => handleSubscriberDelete(sub.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() =>
                setSubscriberPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={subscriberPage === 1}
            >
              Prev
            </button>

            {[...Array(totalSubscriberPages)].map((_, index) => (
              <button
                key={index}
                className={
                  subscriberPage === index + 1 ? styles.activePage : ""
                }
                onClick={() => setSubscriberPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setSubscriberPage((prev) =>
                  Math.min(prev + 1, totalSubscriberPages)
                )
              }
              disabled={subscriberPage === totalSubscriberPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {/* subscribers */}
      <section id="testimonials-management" data-section className={styles.testimonials}>
        <div className={styles.commentTitle}>
          &lt;!-- portfolio testimonials --&gt;
        </div>
        {/* testimonials management */}
        <div className={styles.testimonialsManagement}>
          <div className={styles.tableBody}>
            {currentTestimonials.map((t) => (
              <div key={t.id} className={styles.testimonialRow}>

                {/* LEFT: PROFILE */}
                <div className={styles.testimonialProfile}>
                  <img src={t.profile} alt={t.name} />
                </div>

                {/* CENTER: INFO */}
                <div className={styles.testimonialInfo}>
                  <div className={styles.top}>
                    <span className={styles.name}>{t.name}</span>
                    <span className={styles.job}>{t.job}</span>
                  </div>

                  <div className={styles.middle}>
                    <span>{t.email}</span>
                    <span>{new Date(t.date).toLocaleDateString()}</span>
                  </div>

                  <div className={styles.message}>
                    {t.message}
                  </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className={styles.actions}>
                  <button onClick={() => handleTestimonialView(t)}>
                    View
                  </button>

                  <button onClick={() => handleTestimonialDelete(t.id)}>
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() =>
                setTestimonialPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={testimonialPage === 1}
            >
              Prev
            </button>

            {[...Array(totalTestimonialPages)].map((_, index) => (
              <button
                key={index}
                className={
                  testimonialPage === index + 1 ? styles.activePage : ""
                }
                onClick={() => setTestimonialPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setTestimonialPage((prev) =>
                  Math.min(prev + 1, totalTestimonialPages)
                )
              }
              disabled={testimonialPage === totalTestimonialPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {/* modals */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </Layout>
  );
}
