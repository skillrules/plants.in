import { Link } from "@tanstack/react-router";
import imgBlog1 from "@/assets/product-succulent.jpg";
import imgBlog2 from "@/assets/decor-bright-balcony.png";
import imgBlog3 from "@/assets/decor-living-room.png";
import imgBlog4 from "@/assets/product-fiddle.jpg";

const blogs = [
  {
    title: "Growing Indoor Aloe Vera Plant: Step-by-Step Guide for Beginners",
    excerpt: "Did you know the Aloe Vera plant was called the \"plant of immortality\" in ancient...",
    image: imgBlog1,
    date: "Feb 16 2026",
    link: "#"
  },
  {
    title: "Simple Ways to Protect Your Balcony Plants from Cold Weather",
    excerpt: "Did you know plants can actually 'feel' the cold? When the temperature drops, they make...",
    image: imgBlog2,
    date: "Feb 11 2026",
    link: "#"
  },
  {
    title: "Watering Indoor Plants: Techniques for Healthy Growth",
    excerpt: "If you love taking care of your indoor plants, you might already know they bring...",
    image: imgBlog3,
    date: "Feb 10 2026",
    link: "#"
  },
  {
    title: "Calm Corners with Indoor Office Plants: The Elegance of Dwarf Fiddle...",
    excerpt: "Did you know that the Fiddle Leaf Fig is nicknamed the \"Instagram plant\" because it's...",
    image: imgBlog4,
    date: "Feb 08 2026",
    link: "#"
  }
];

export function BlogSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
          Our Blogs
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog, index) => (
          <div 
            key={index} 
            className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-elegant transition-all duration-300 p-3 pb-5 cursor-pointer"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl mb-4 bg-secondary/50">
              <img 
                src={blog.image} 
                alt={blog.title} 
                loading="lazy" 
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
              />
            </div>
            <div className="flex flex-col flex-grow px-1">
              <h3 className="text-[15px] font-bold text-foreground leading-snug mb-2 group-hover:text-primary-deep transition-colors">
                {blog.title}
              </h3>
              <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2 flex-grow">
                {blog.excerpt}
              </p>
              <div className="text-[11px] font-medium text-muted-foreground/60 mt-auto">
                {blog.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
