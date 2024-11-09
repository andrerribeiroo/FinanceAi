import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summury-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const HomePage = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect("?month=01");
  }

  return (
    <>
      <Navbar />
      <div className=" space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">DashBoard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-[2fr,1fr]">
          <SummaryCards month={month} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
