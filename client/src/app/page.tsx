import Loading from "@/components/Loading";

const Home = () => {
  // The GlobalAuthGuard will handle all authentication logic
  // and redirect appropriately, so this component should never actually render
  // But just in case, show loading
  return <Loading />;
}

export default Home;