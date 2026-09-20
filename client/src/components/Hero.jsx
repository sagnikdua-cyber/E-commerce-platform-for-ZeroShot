import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 h-[500px]">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-40"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Shop interior"
        />
        <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" aria-hidden="true" />
      </div>
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover Your Next Favorite Item
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Explore our curated collection of premium products. From electronics to fashion, we have everything you need to elevate your lifestyle.
        </p>
        <div className="mt-10 flex justify-center sm:justify-start">
          <Link
            to="/products"
            className="inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 md:text-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
