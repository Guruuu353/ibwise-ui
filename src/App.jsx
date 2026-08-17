import AppRouter from "./routes/AppRouter";
import RouteLoader from "./components/ui/RouteLoader";

export default function App() {
  return (
    <>
      <RouteLoader />
      <AppRouter />
    </>
  );
}
