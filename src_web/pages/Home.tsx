import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Droplet, Shield, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "Test Your Water Quality Today",
    subtitle: "Get accurate results in minutes",
    color: "from-blue-500 to-cyan-500",
    icon: Droplet,
  },
  {
    id: 2,
    title: "Pure Water, Healthy Life",
    subtitle: "Ensure your family's safety",
    color: "from-teal-500 to-emerald-500",
    icon: Shield,
  },
  {
    id: 3,
    title: "Eco-Friendly Testing Kits",
    subtitle: "Safe for you and the planet",
    color: "from-green-500 to-lime-500",
    icon: Leaf,
  },
];

const articles = [
  {
    id: 1,
    title: "Understanding pH Levels in Drinking Water",
    excerpt: "Learn why pH balance matters for your health and how to test it effectively at home.",
    date: "2025-10-05",
    readTime: "5 min read",
    category: "Health",
  },
  {
    id: 2,
    title: "Common Water Contaminants in Indian Cities",
    excerpt: "A comprehensive guide to pollutants found in urban water supplies and their health impacts.",
    date: "2025-10-03",
    readTime: "8 min read",
    category: "Safety",
  },
  {
    id: 3,
    title: "DIY Water Quality Testing: Complete Guide",
    excerpt: "Step-by-step instructions for testing water quality at home using litmus strips.",
    date: "2025-10-01",
    readTime: "6 min read",
    category: "Tutorial",
  },
  {
    id: 4,
    title: "The Importance of Clean Water Access",
    excerpt: "Exploring the impact of water quality on public health across different regions.",
    date: "2025-09-28",
    readTime: "7 min read",
    category: "Awareness",
  },
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Banner Carousel */}
      <section className="relative h-48 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full h-full bg-gradient-to-br ${banner.color} flex items-center justify-center p-6 cursor-pointer`}
              onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}
            >
              <div className="text-center text-white">
                <banner.icon className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p className="text-white/90">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBanner === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Articles Feed */}
      <section className="flex-1 px-4 py-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Latest Water News</h3>
          <Badge variant="secondary">India</Badge>
        </div>

        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {article.category}
                  </Badge>
                  <h4 className="font-semibold text-base mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
