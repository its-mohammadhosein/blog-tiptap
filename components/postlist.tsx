// components/PostTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post } from "@prisma/client";
import Link from "next/link";

type PostWithAuthor = Post & {
  author: { email: string };
};

type Props = {
  posts: PostWithAuthor[];
};

export function PostTable({ posts }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead> {/* New column for actions */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.slug}</TableCell>
            <TableCell>{post.author.email}</TableCell>
            <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {/* Action links for Edit and Preview */}
              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/${post.id}/edit`}  // Replace with actual URL
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/preview/${post.id}`} // Replace with actual URL
                  className="text-green-500 hover:underline"
                >
                  Preview
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
