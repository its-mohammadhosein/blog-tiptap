// app/blog/[id]/page.tsx

import { renderTiptapToJSX } from "@/app/lib/jsontocomp";
import { links } from "@/app/lib/links";

export default async function BlogPage({
  params,
}: {
  params: { post: string };
}) {
  const res = await fetch(`${links.baseUrl}/api/blog/${params.post}`, {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);

  // console.log("Render", renderTiptapToJSX(data.content.content));
  // return null
  return (
    <div className="prose max-w-none p-6">
      {/* {renderTiptapToJSX(data.content)} */}
      {/* <div dangerouslySetInnerHTML={{ __html: data.content }} /> */}
    </div>
  );
}
