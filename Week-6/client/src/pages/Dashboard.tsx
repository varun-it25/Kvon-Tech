import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Container from "@/components/Container";
import { CheckCircle, Clock, Layers, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DonutChart from "@/components/ui/DonutChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

interface Task {
  userId: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: "High" | "Medium" | "Low";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChartData {
  name: string;
  value: number;
}

const Dashboard = () => {
  const nav = useNavigate();
  const [cookie] = useCookies(["session"]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [high, setHigh] = useState<number>(0);
  const [medium, setMedium] = useState<number>(0);
  const [low, setLow] = useState<number>(0);

  const data1: ChartData[] = [
    { name: "Low", value: low },
    { name: "High", value: high },
    { name: "Medium", value: medium },
  ];

  const data2: ChartData[] = [
    { name: "Completed", value: completed },
    { name: "In-Progress", value: inProgress },
  ];

  const COLORS1: string[] = ["#FF6384", "#36A2EB", "#FFCE56"];
  const COLORS2: string[] = ["oklch(72.3% 0.219 149.579)", "oklch(70.5% 0.213 47.604)"];

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("http://localhost:5000/tasks", {
        headers: { token: cookie.session },
      });
      const tasksData = response.data;
      setTasks(tasksData);

      const completedCount = tasksData.filter((t) => t.isCompleted).length;
      setCompleted(completedCount);
      setInProgress(tasksData.length - completedCount);
      setHigh(tasksData.filter((t) => t.priority === "High").length);
      setMedium(tasksData.filter((t) => t.priority === "Medium").length);
      setLow(tasksData.filter((t) => t.priority === "Low").length);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="w-full h-full flex">
      <Sidebar route="dashboard" />
      <div className="flex-1 h-full bg-zinc-100 flex flex-col">
        <Navbar tab="Dashboard" />
        <Container>
          <div className="w-full h-full rounded-xl flex flex-col gap-4 mt-[-1rem]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="w-full bg-white hover:bg-orange-50 p-6 sm:p-8 flex justify-center items-center rounded-lg space-x-2.5 font-semibold cursor-pointer">
                <Layers className="ml-[-0.4rem]" />
                <p>Total Tasks</p>
                <p className="text-orange-500 font-bold text-lg">{tasks.length}</p>
              </div>
              <div className="w-full bg-white hover:bg-green-50 p-6 sm:p-8 flex justify-center items-center rounded-lg space-x-2.5 font-semibold cursor-pointer">
                <CheckCircle className="ml-[-0.4rem]" />
                <p>Completed Tasks</p>
                <p className="text-green-500 font-bold text-lg">{completed}</p>
              </div>
              <div className="w-full bg-white hover:bg-sky-50 text-sky-600 p-6 sm:p-8 flex justify-center items-center rounded-lg space-x-2.5 font-semibold cursor-pointer" onClick={() => nav("/create-task")}>
                <Plus className="ml-[-0.4rem]" />
                <p>Create New Task</p>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full h-full bg-white rounded-xl flex flex-col">
                <div className="px-4 pt-4 flex items-center gap-2">
                  <div className="w-8 aspect-square rounded-full bg-zinc-100 flex justify-center items-center pb-1">📌</div>
                  <p className="text-sm font-medium pb-[2px]">Priority chart</p>
                </div>
                <div className="flex-1 w-full flex justify-center items-center">
                  <DonutChart data={data1} COLORS={COLORS1} />
                </div>
                <div className="px-4 pb-6 gap-12 flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 aspect-square rounded-full bg-[#36A2EB] pb-1"></div>
                    <p className="text-sm font-medium pb-[2px]">High</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 aspect-square rounded-full bg-[#FFCE56] pb-1"></div>
                    <p className="text-sm font-medium pb-[2px]">Medium</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 aspect-square rounded-full bg-[#FF6384] pb-1"></div>
                    <p className="text-sm font-medium pb-[2px]">Low</p>
                  </div>
                </div>
              </div>

              <div className="w-full h-full bg-white rounded-xl flex flex-col">
                <div className="px-4 pt-4 flex items-center gap-2">
                  <div className="w-8 aspect-square rounded-full bg-zinc-100 flex justify-center items-center pb-[1px] text-sky-500">
                    <Clock size={16} />
                  </div>
                  <p className="text-sm font-medium pb-[2px]">Progress chart</p>
                </div>
                <div className="flex-1 w-full flex justify-center items-center">
                  <DonutChart data={data2} COLORS={COLORS2} />
                </div>
                <div className="px-4 pb-6 gap-12 flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 aspect-square rounded-full bg-green-500 pb-1"></div>
                    <p className="text-sm font-medium pb-[2px]">Completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 aspect-square rounded-full bg-orange-500 pb-1"></div>
                    <p className="text-sm font-medium pb-[2px]">In Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;