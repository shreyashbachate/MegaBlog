import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import services from "../appwrite/config";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    services.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  const status = useSelector((state) => state.auth.status);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              {!status && (
                <h1 className="text-2xl text-white font-bold hover:text-red-500">
                  Login to read posts
                </h1>
              )}
              {status && (
                <h1 className="text-2xl text-white font-bold hover:text-green-500">
                  Loading...
                </h1>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
