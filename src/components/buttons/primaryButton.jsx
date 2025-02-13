const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 bg-gradient-to-r from-[#111827] to-[#3b1d27] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b1d27] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
