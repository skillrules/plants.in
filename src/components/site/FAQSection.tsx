import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do you ensure plants arrive healthy?",
    answer: "We use specially designed packaging that secures the pot and protects the foliage. All our plants are watered right before shipping to ensure they stay hydrated during transit."
  },
  {
    question: "What happens if my plant arrives damaged?",
    answer: "We have a 30-Day Plant Health Guarantee! If your plant arrives damaged or sick, just reach out to us with a photo and we'll send a free replacement right away."
  },
  {
    question: "Do you provide care instructions?",
    answer: "Yes! Every order comes with a detailed care card specific to your plant, covering watering, light requirements, and general maintenance."
  },
  {
    question: "Are your plants pet-friendly?",
    answer: "We have a dedicated 'Pet Friendly' category! While some of our plants are toxic to cats and dogs if ingested, we clearly label which ones are safe for your furry friends."
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-5 business days. We ship out orders from Monday to Wednesday to ensure plants don't sit in a warehouse over the weekend."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to reach out to our team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl transition-smooth ${isOpen ? 'bg-[#fcfcf9] border-primary/20 shadow-soft' : 'bg-card border-border hover:border-primary/30'}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className={`font-bold text-base md:text-lg transition-colors ${isOpen ? 'text-primary-deep' : 'text-foreground'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 p-1.5 rounded-full transition-colors ${isOpen ? 'bg-primary/10 text-primary-deep' : 'bg-secondary text-muted-foreground'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
