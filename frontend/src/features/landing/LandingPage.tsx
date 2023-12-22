import withLayout from "../../hoc/withLayout";

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Blog Post app</h1>
        <p className="text-gray-600 mb-8">
          Explore amazing features and services.
        </p>
      </div>
    </div>
  );
};

export default withLayout(LandingPage);
