const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-900 text-white p-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            About Student Sphere App
          </h1>
          <p className="text-lg max-w-md text-gray-300">
            Student Sphere App is a cutting-edge platform designed to streamline academic management, enhance communication between students, teachers, and administrators, and empower students on their educational journey.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-10 justify-center items-center relative">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Our Mission</h2>
            <p className="text-gray-300">
              To provide an intuitive, user-friendly platform that enhances the educational experience by making information accessible, communication seamless, and management efficient.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Our Vision</h2>
            <p className="text-gray-300">
              To be the go-to platform for educational institutions worldwide, fostering an environment where learning and growth are at the forefront.
            </p>
          </div>
          <img 
            src="/path-to-your-image.jpg" 
            alt="Decorative" 
            className="absolute top-0 left-0 w-1/2 h-full object-cover opacity-40" 
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
