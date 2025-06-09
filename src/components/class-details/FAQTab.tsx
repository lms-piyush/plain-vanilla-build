
import { Card, CardContent } from "@/components/ui/card";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQTabProps {
  faqs: FAQ[];
}

const FAQTab = ({ faqs }: FAQTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-3">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">{faq.question}</h4>
              <p className="text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQTab;
