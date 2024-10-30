import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
  });

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/community");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      await axios.post("http://localhost:8080/community", {
        userId: userId,
        content: newPost,
      });
      setNewPost("");
      await fetchPosts();
    } catch (error) {
      console.error("Error creating community post:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <center>
          <h2>Community Hub</h2>
        </center>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <br />
          <center>
            <button className="btn btn-primary mt-2" onClick={handleCreatePost}>
              Post
            </button>
          </center>
          <hr />
        </div>
        <div>
          <center>
            <h3>Previous Posts</h3>
          </center>
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{ height: "300px", overflow: "hidden" }}
                >
                  <div
                    className="card-body d-flex flex-column"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {post.user ? (
                      <h5 className="card-title text-primary">
                        User: {post.user.name}
                      </h5>
                    ) : post.stationMaster ? (
                      <h5 className="card-title text-success">
                        Station Master: {post.stationMaster.fullName}
                      </h5>
                    ) : null}
                    <p
                      className="card-text flex-grow-1"
                      style={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.content}
                    </p>
                    <div
                      className="text-muted small mt-auto"
                      style={{ marginTop: "auto" }}
                    >
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
