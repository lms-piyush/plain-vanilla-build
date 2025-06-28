
const AccessibilitySkipLink = () => {
  const skipToContent = () => {
    const content = document.getElementById("main-content");
    if (content) {
      content.focus();
      content.scrollIntoView();
    }
  };

  return (
    <a 
      href="#main-content" 
      onClick={skipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:text-white focus:p-4 focus:m-2 focus:rounded-md"
    >
      Skip to content
    </a>
  );
};

export default AccessibilitySkipLink;
