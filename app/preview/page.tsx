// app/(dashboard)/posts/page.tsx
// import { PostTable } from "@/components/PostTable";

import { PostTable } from "@/components/postlist";

// Server-side fetch for posts
export default async function PostsPage() {
  // Fetching the posts from the API endpoint
  const res = await fetch("http://localhost:3000/api/blog/post"); // Adjust the base URL if needed
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Posts</h1>
      <PostTable posts={posts} />
    </div>
  );
}
