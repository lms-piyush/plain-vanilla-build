
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-8 md:py-16 bg-talent-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-talent-secondary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-talent-secondary/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Help Your Child Discover Their Talents?
          </h2>
          <p className="text-white/80 text-sm md:text-lg mb-6 md:mb-8">
            Join thousands of families who are nurturing their children's growth with TalentSchool's expert-led classes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button className="bg-white text-talent-primary hover:bg-gray-100 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto" asChild>
              <Link to="/student/explore">Browse Classes</Link>
            </Button>
            <Button className="bg-white text-talent-primary hover:bg-gray-100 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6 h-auto w-full sm:w-auto" asChild>
              <Link to="/dashboard">Become a Tutor</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
