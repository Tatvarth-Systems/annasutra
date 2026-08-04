import { redirect } from "next/navigation";

/** Root page redirects to welcome. */
const Page = () => {
  redirect("/welcome");
};

export default Page;
