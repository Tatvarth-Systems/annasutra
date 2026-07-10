import { redirect } from "next/navigation";

/** Root page redirects to signin. */
const Page = () => {
  redirect("/signin");
};

export default Page;
