import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteData from "@/data/site-data.json";
import { PostBody } from "@/components/blog/BlogList";
import { getPost, getPosts } from "@/lib/api";

export async function generateStaticParams() {
  const posts = await getPosts();
  // A static export needs at least one path; with no articles this renders the 404 page.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "no-posts" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  return p ? { title: p.title, description: p.excerpt } : { title: siteData.content.blog.post.notFound };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  return <PostBody i={i} />;
}
