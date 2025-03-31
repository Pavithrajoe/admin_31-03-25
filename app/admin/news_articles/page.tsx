"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const testBlogs = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      user_id: `U${1000 + index}`,
      blog_content: `Sample blog content for blog ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      image: `https://via.placeholder.com/150?text=Blog+${index + 1}`, // Placeholder blog image
      active: index % 2 === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    setBlogs(testBlogs);
    setLoading(false);
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold custom-heading">Our Blogs</h2>
        <button className="custom-add-button" onClick={() => router.push("/admin/blogs/add_blog")}>
          Add Blog
        </button>
      </div>

      <div className="table-responsive rounded">
        {loading ? (
          <p className="text-muted text-center">Loading...</p>
        ) : (
          <table className="table table-hover table-bordered custom-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Content</th>
                <th>Image</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>#{blog.id}</td>
                  <td>{blog.user_id}</td>
                  <td className="content-column">
                    <span>
                      {expanded[blog.id] ? blog.blog_content : `${blog.blog_content.slice(0, 50)}...`}
                      <button className="read-more-btn" onClick={() => toggleExpand(blog.id)}>
                        {expanded[blog.id] ? "Read Less" : "Read More"}
                      </button>
                    </span>
                  </td>
                  <td>
                    <img
                      src={blog.image}
                      alt="Blog"
                      width="50"
                      height="50"
                      className="rounded cursor-pointer"
                      onClick={() => openModal(blog.image)}
                    />
                  </td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge px-3 py-2 text-white ${blog.active ? "bg-success" : "bg-danger"}`}>
                      {blog.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(blog.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Image Zoom Popup */}
      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Zoomed Blog Image" />
            <button className="close-btn" onClick={closeModal}>×</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-heading {
          font-size: 25px;
        }

        .custom-add-button {
          background: linear-gradient(to right, #004d7a, #0083b0);
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 8px 20px;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          transition: 0.3s ease-in-out;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .custom-add-button:hover {
          background: linear-gradient(to right, #003d5c, #006f99);
        }

        .custom-table {
          font-size: 13px;
        }

        .table th,
        .table td {
          text-align: center;
          vertical-align: middle;
          padding: 10px;
          font-size: 13px;
        }

        .content-column {
          max-width: 260px;
          min-width: 200px;
          word-break: break-word;
          white-space: normal;
          overflow: hidden;
        }

        .read-more-btn {
          background: none;
          border: none;
          color: #007bff;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
          margin-left: 5px;
        }

        .read-more-btn:hover {
          color: #0056b3;
        }

        .badge {
          font-size: 12px;
          font-weight: bold;
          padding: 7px 14px;
          border-radius: 18px;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        /* Image Modal Styles */
        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .image-modal-content {
          position: relative;
          background: white;
          padding: 10px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
        }

        .image-modal-content img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 8px;
        }

        .close-btn {
          position: absolute;
          top: 5px;
          right: 10px;
          font-size: 24px;
          background: none;
          border: none;
          color: black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
