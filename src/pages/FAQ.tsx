import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I use the water testing kit?",
        a: "Simply dip the test strip in water for 2 seconds, then use our app to capture both the strip and the color chart. Our AI will analyze the results and provide a detailed report.",
      },
      {
        q: "Do I need to buy the testing kit?",
        a: "Yes, you'll need our 16-parameter testing kit which includes test strips and a color comparison chart. The kit is available in the Shop tab.",
      },
    ],
  },
  {
    category: "Testing Process",
    questions: [
      {
        q: "How accurate are the results?",
        a: "Our AI-powered analysis provides 92%+ accuracy when images are captured in good lighting conditions. Results are comparable to laboratory testing for most parameters.",
      },
      {
        q: "Can I test any type of water?",
        a: "Yes! You can test drinking water, well water, tap water, or any water source you're concerned about. The kit works with all freshwater sources.",
      },
      {
        q: "How long does testing take?",
        a: "The entire process takes about 3-5 minutes: 2 seconds for the strip reaction, plus time to capture images and receive AI analysis results.",
      },
    ],
  },
  {
    category: "Understanding Results",
    questions: [
      {
        q: "What pH level is safe for drinking water?",
        a: "Safe drinking water typically has a pH between 6.5 and 8.5. Our app will indicate if your water falls outside this range and provide recommendations.",
      },
      {
        q: "What should I do if contaminants are detected?",
        a: "The app provides specific recommendations based on detected contaminants. This may include water filtration, boiling, or professional testing for certain parameters.",
      },
      {
        q: "Can I save and share my test results?",
        a: "Yes! All test results are automatically saved in the app. You can download PDF reports or share them directly via social media or messaging apps.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        q: "Why is my camera not working?",
        a: "Ensure you've granted camera permissions in your device settings. If issues persist, try restarting the app or your device.",
      },
      {
        q: "Can I use the app offline?",
        a: "You can capture images offline, but you'll need an internet connection for AI analysis. Results will sync when you're back online.",
      },
      {
        q: "How often should I test my water?",
        a: "We recommend testing every 3-6 months for household water, or immediately if you notice changes in taste, smell, or appearance.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFaqs.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-semibold text-lg text-primary">{category.category}</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, faqIdx) => (
                  <AccordionItem 
                    key={faqIdx} 
                    value={`${idx}-${faqIdx}`}
                    className="border rounded-lg px-4 bg-card"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
