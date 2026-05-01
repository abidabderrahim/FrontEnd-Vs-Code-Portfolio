import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import TurndownService from "turndown";
import { marked } from "marked";
import MDEditor, { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { VscClose, VscCloudUpload } from "react-icons/vsc";
import styles from "./addProjectModal.module.css";

const ProjectModal = ({ isOpen, onClose, editingProject }) => {
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [optionOpen, setOptionOpen] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isConverted, setIsConverted] = useState(false);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };

  // Close modal
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Dummy categories
  useEffect(() => {
    if (isOpen) {
      setCategories([
        { _id: 1, name: "Web" },
        { _id: 2, name: "Mobile" },
        { _id: 3, name: "UI/UX" },
      ]);
    }
  }, [isOpen]);

  // Editing mode
  useEffect(() => {
    if (editingProject) {
      const turndownService = new TurndownService();
      setTitle(editingProject.title || "");
      setDescription(editingProject.description || "");
      setContent(turndownService.turndown(editingProject.content || ""));
      setImage(editingProject.image || "");
      setPreview(editingProject.image || "");
      setTechStack(editingProject.techStack || []);
      setLink(editingProject.link || "");
      setSelectedCategory(editingProject.category || null);
    } else {
      setTitle("");
      setDescription("");
      setContent("");
      setImage("");
      setPreview("");
      setTechStack([]);
      setLink("");
      setSelectedCategory(null);
      setNewCategory("");
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  // Image (frontend only)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type))
      return showError("Only JPG, PNG, GIF allowed");
    if (file.size > 5 * 1024 * 1024)
      return showError("Image must be smaller than 5MB");

    setPreview(URL.createObjectURL(file));
    setImage(file.name);
  };

  // Validation
  const validateForm = () => {
    if (!image) return "Image is required";
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    if (!content.trim()) return "Content cannot be empty";
    if (!selectedCategory && !newCategory.trim())
      return "Category is required";
    return null;
  };

  // Add category (frontend)
  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return showError("Enter a category");

    const newCat = { _id: Date.now(), name };
    setCategories([...categories, newCat]);
    setSelectedCategory(newCat);
    setNewCategory("");
  };

  // Editor image upload (frontend)
  const uploadImageCommand = {
    name: "upload-image",
    keyCommand: "upload-image",
    buttonProps: { "aria-label": "Upload Image" },
    icon: <i className="ri-image-add-line"></i>,
    execute: (state, api) => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        api.replaceSelection(`![${file.name}](${url})`);
      };

      fileInput.click();
    },
  };

  // Convert
  const handleConvertToHtml = () => {
    try {
      const html = marked.parse(content || "");
      setContent(html);
      setIsConverted(true);
    } catch {
      showError("Conversion failed");
    }
  };

  // Submit (frontend only)
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) return showError(validationError);

    const htmlContent = isConverted
      ? content
      : DOMPurify.sanitize(marked.parse(content || ""));

    const projectData = {
      image,
      title,
      description,
      category: selectedCategory?.name || newCategory,
      techStack,
      link,
      content: htmlContent,
    };

    console.log("PROJECT DATA:", projectData);

    onClose();
  };

  return (
    <div className={styles.projectModal} onClick={onClose}>
      <div
        className={`${styles.modal} ${isOpen ? styles.active : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {editingProject ? "Update Project" : "Create Project"}
            </h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <VscClose />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Image */}
            <label className={styles.uploadContainer}>
              {image ? (
                <img
                  src={preview || image}
                  alt="uploaded"
                  className={styles.uploadedImage}
                />
              ) : (
                <div className={styles.uploadCI}>
                  <VscCloudUpload />
                </div>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className={styles.uploadInput}
              />
            </label>

            <input
              type="text"
              value={title}
              placeholder="Project Title"
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleInput}
            />

            <textarea
              rows="3"
              value={description}
              placeholder="Short description"
              onChange={(e) => setDescription(e.target.value)}
              className={styles.descInput}
            />

            {/* Category */}
            <div className={styles.newCategory}>
              <input
                type="text"
                value={newCategory}
                placeholder="New category"
                onChange={(e) => setNewCategory(e.target.value)}
                className={styles.categoryInput}
              />
              <button
                type="button"
                className={styles.addCategoryBtn}
                onClick={handleAddCategory}
              >
                + Add
              </button>
            </div>

            <div
              className={`${styles.customSelect} ${
                optionOpen ? styles.open : ""
              }`}
            >
              <div
                className={styles.selected}
                onClick={() => setOptionOpen(!optionOpen)}
              >
                {selectedCategory?.name || "Select existing category"}
                <i className="ri-arrow-down-s-line"></i>
              </div>

              <div className={styles.options}>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`${styles.option} ${
                      selectedCategory?._id === cat._id ? styles.active : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOptionOpen(false);
                    }}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className={styles.techStack}>
              <div className={styles.addStack}>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className={styles.toolInput}
                  placeholder="React, Node..."
                />
                <button
                  type="button"
                  className={styles.addTool}
                  onClick={() => {
                    if (
                      techInput.trim() &&
                      !techStack.includes(techInput.trim())
                    ) {
                      setTechStack([...techStack, techInput.trim()]);
                      setTechInput("");
                    }
                  }}
                >
                  Add
                </button>
              </div>

              <div className={styles.tools}>
                {techStack.map((tool, i) => (
                  <span key={i} className={styles.tool}>
                    {tool}
                    <button
                      type="button"
                      className={styles.removeTool}
                      onClick={() =>
                        setTechStack(techStack.filter((t) => t !== tool))
                      }
                    >
                      <VscClose />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Project link"
              className={styles.projectLink}
            />

            {/* Editor */}
            <div className={styles.editor}>
              <MDEditor
                value={content}
                onChange={setContent}
                height={400}
                commands={[
                  commands.bold,
                  commands.italic,
                  commands.title,
                  commands.link,
                  commands.quote,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.code,
                  commands.codeBlock,
                  uploadImageCommand,
                  commands.fullscreen,
                ]}
              />
            </div>

            <button
              type="button"
              onClick={handleConvertToHtml}
              className={styles.converttohtmlBtn}
            >
              Convert to HTML
            </button>

            <button type="submit" className={styles.submitBtn}>
              {editingProject ? "Update Project" : "Create Project"}
            </button>
          </form>

          {error && <div className={styles.messageError}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;