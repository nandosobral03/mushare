import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import CreateGrid from "./create-grid";

const CreateGridPage = async () => {
  const isAuthenticated = await api.auth.getSession();
  if (!isAuthenticated) {
    redirect("/grid");
  }
  return <CreateGrid />;
};

export default CreateGridPage;
