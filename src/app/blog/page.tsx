import type { Metadata } from "next";
import { Crumb, PageHeader } from "@/components/layout/PageHeader";
import { BlogList } from "@/components/blog/BlogList";
import { pageMeta } from "@/lib/seo";
import { Field } from "@/lib/site-data";

export const metadata: Metadata = pageMeta("blog");

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Field data-preview-field-path="blog.header.eyebrow" />}
        title={<Field data-preview-field-path="blog.header.title" />}
        crumbs={[<Crumb key="c" data-preview-field-path="blog.header.crumbHref" label={<Field data-preview-field-path="blog.header.crumbLabel" />} />]}
      />
      <section className="container-x py-12 md:py-16">
        <BlogList />
      </section>
    </>
  );
}
