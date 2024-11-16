import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import CreateChart from "./create-chart";

const CreateChartPage = async () => {
  const isAuthenticated = await api.auth.getSession();
  if (!isAuthenticated) {
    redirect("/chart");
  }
  return <CreateChart />;
};

export default CreateChartPage;
