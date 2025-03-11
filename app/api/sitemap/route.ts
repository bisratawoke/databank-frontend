import { NextResponse } from "next/server";
import { SitemapStream, streamToPromise } from "sitemap";

export async function GET() {
  // Replace with your API endpoint that returns your pages
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/reports/pages`);

  if (!res.ok) {
    return NextResponse.error();
  }

  const hostname = "http://localhost:3000";
  // Assuming your API returns an array of pages with a URL property
  const pages = await res.json();

  // Create a SitemapStream instance with your hostname
  const sitemapStream = new SitemapStream({
    hostname, // Replace with your domain
  });

  // Write static pages if necessary
  //   sitemapStream.write({ url: "/", changefreq: "daily", priority: 1.0 });

  // Write dynamic pages fetched from your REST API
  pages.forEach((page: any) => {
    sitemapStream.write({
      url: `${hostname}/reports/${page._id}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  // End the stream
  sitemapStream.end();

  // Convert the stream to a string (XML)
  const sitemapXML = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  return new NextResponse(sitemapXML, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
