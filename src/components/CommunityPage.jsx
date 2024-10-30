import React, { useState, useEffect } from "react";
import axios from "axios";

const CommunityPage = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

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
    <div className="container my-5">
      <h2>Community</h2>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Share your thoughts..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleCreatePost}>
          Post
        </button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="card mb-3">
            <div className="card-body">
              {post.user ? (
                <h5 className="card-title">User: {post.user.name}</h5>
              ) : post.stationMaster ? (
                <h5 className="card-title">
                  Station Master: {post.stationMaster.name}
                </h5>
              ) : null}
              <p>{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
