import { PostWithAuthor } from "@/app/(blogEDIT)/dashboard/page";
import { links } from "@/app/lib/links";

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const data = await fetch(`${links.baseUrl}/api/blog/${slug}`);
  if (!data.ok) {
    return <div>post not Found</div>;
  }
  const post = (await data.json()) as PostWithAuthor;
  console.log(post);

  return (
    <div className="w-full flex justify-center bg-purple-50 min-h-[345px] py-4">
      <div className="w-full h-full max-w-[1280px]  bg-white/40 rounded-md border flex justify-center p-2">
        <div
          className="text-wrap [&>pre]:w-full [&>pre]:text-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
