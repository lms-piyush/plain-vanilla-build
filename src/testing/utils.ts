
// Delay function for sequential auto-filling with shorter delays for faster execution
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to scroll to top of form
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Generate test data for class creation
export const generateTestData = (classType: string) => {
  const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // One week from now
  const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 months from now
  
  return {
    title: `Auto-generated ${classType.replace(/-/g, ' ')} Test Class`,
    subject: "Technology & Coding",
    description: `This is an automatically generated ${classType} class for testing purposes. It includes a detailed description of what students will learn in this comprehensive course covering modern programming concepts and practical applications.`,
    thumbnailUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&h=450&q=80",
    frequency: "weekly" as const,
    startDate,
    endDate,
    totalSessions: 12,
    price: 29.99,
    currency: "USD" as const,
    autoRenewal: true
  };
};
