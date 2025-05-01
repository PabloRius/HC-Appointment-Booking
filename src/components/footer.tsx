export const Footer = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="flex flex-col gap-4 p-10 md:flex-row md:gap-8 md:p-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-teal-600"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="text-xl font-bold">MediConnect</span>
          </div>
          <p className="text-sm text-gray-500">
            Connecting patients and healthcare professionals for better
            healthcare management.
          </p>
        </div>
      </div>
      <p className="border-t p-6 text-center text-sm text-gray-500 md:text-left">
        © {new Date().getFullYear()} MediConnect. All rights reserved.
      </p>
    </footer>
  );
};
