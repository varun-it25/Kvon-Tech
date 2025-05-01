import axios from "axios";
import Navbar from "@/components/Navbar";
import { useCookies } from "react-cookie";
import Sidebar from "@/components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { EllipsisVertical, Eye, Pen, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskType {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  priority: string;
  createdAt: string;
}

function PriorityTag({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    High: "border-red-200 text-red-600",
    Medium: "border-sky-300 text-sky-600",
    Low: "border-green-300 text-green-600"
  };
  return <div className={`px-4 py-1 border ${colors[priority]} text-xs font-semibold rounded-full`}>{priority}</div>;
}

function Tag({ tag }: { tag: string }) {
  return <div className="bg-zinc-100 text-[9px] px-3 py-0.5 rounded font-medium">{tag}</div>;
}

function TaskItem({ id, title, description, tags, priority, date, onDelete }: { id: string; title: string; description: string; tags: string[]; priority: string; date: string; onDelete: (id: string) => void; }) {
  const nav = useNavigate();
  return (
    <div className="w-full p-5 bg-white rounded-xl space-y-4">
      <div className="w-full flex justify-between items-center pr-1">
        <p className="font-semibold">{title.length > 24 ? `${title.slice(0, 24)}...` : title}</p>
        <Popover>
          <PopoverTrigger>
            <button className="w-7 aspect-square rounded-full flex justify-center items-center hover:bg-zinc-100 cursor-pointer text-zinc-500">
              <EllipsisVertical size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-3.5">
            <p className="text-xs font-semibold pb-1.5 pl-1 text-zinc-400">Actions</p>
            <div className="flex flex-col space-y-2.5">
              <button className="flex border-sky-100 border items-center space-x-2.5 text-sky-600 text-sm font-semibold bg-sky-50 cursor-pointer hover:bg-sky-100 py-2 rounded-lg px-4"><Eye size={15} /> <p>View</p></button>
              <button onClick={() => nav(`/update-task/${id}`)} className="flex border-purple-100 border items-center space-x-2.5 text-purple-600 text-sm font-semibold bg-purple-50 cursor-pointer hover:bg-purple-100 py-2 rounded-lg px-4"><Pen size={15} /> <p>Edit</p></button>
              <button onClick={() => window.confirm("Are you sure you want to delete this task?") && onDelete(id)} className="flex items-center space-x-2.5 text-red-600 text-sm border-red-100 border font-semibold bg-red-50 cursor-pointer hover:bg-red-100 py-2 rounded-lg px-4"><Trash2 size={15} /> <p>Delete</p></button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-sm text-zinc-400 mt-[-0.4rem]">{description.length > 38 ? `${description.slice(0, 38)}...` : description}</p>
      <div className="flex overflow-auto text-nowrap scrollbar gap-2 pb-2">
        {tags.map((tag, i) => <Tag key={i} tag={tag} />)}
      </div>
      <div className="flex items-center justify-between pr-3">
        <div className="flex gap-2 items-center">
          <p className="text-xs font-semibold">Priority:</p>
          <PriorityTag priority={priority} />
        </div>
        <div className="text-xs border font-semibold flex rounded-2xl space-x-1 py-0.5 px-3">
          <p>Date:</p>
          <p className="text-zinc-400">{date}</p>
        </div>
      </div>
    </div>
  );
}

const Tasks = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cookie] = useCookies(["session"]);
  const nav = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks", { headers: { token: cookie.session } });
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, { headers: { token: cookie.session } });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      alert("Failed to delete task.");
    }
  };

  const uniqueTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (priorityFilter !== "All") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (tagFilter !== "All") {
      result = result.filter((t) => t.tags.includes(tagFilter));
    }
    if (searchTerm.trim() !== "") {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result.sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [tasks, priorityFilter, tagFilter, sortOrder, searchTerm]);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="w-full h-full flex">
      <Sidebar route="tasks" />
      <div className="flex-1 h-full bg-zinc-100 flex flex-col">
        <Navbar tab="Tasks" />
        <Container>
          <div className="w-full h-full rounded-xl flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 justify-between">
              <Input className="bg-white flex-1 w-full sm:w-64" placeholder="Search task..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

              <Select onValueChange={(val) => setPriorityFilter(val)} defaultValue="All">
                <SelectTrigger className="bg-white cursor-pointer">
                  <p className="font-semibold">Priority: </p>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "High", "Medium", "Low"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => setTagFilter(val)} defaultValue="All">
                <SelectTrigger className="bg-white cursor-pointer">
                  <p className="font-semibold">Tags: </p>
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {uniqueTags.map((tag) => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select onValueChange={(val: "latest" | "oldest") => setSortOrder(val)} defaultValue="latest">
                <SelectTrigger className="bg-white cursor-pointer">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>

              <Button className="cursor-pointer" onClick={() => nav("/create-task")}><Plus size={16} /> Add Task</Button>
            </div>

            {
              filteredTasks.length == 0 && <div className="w-full flex-1 bg-white justify-center flex items-center rounded-xl font-semibold text-zinc-400 text-xl py-12">There is no tasks.</div>
            }

            {
              loading
                ? <p className="text-zinc-500 text-sm mt-10">Loading tasks...</p>
                : error
                  ? <p className="text-red-500 text-sm mt-10">{error}</p>
                  : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {
                      filteredTasks.map((task) => <TaskItem key={task._id} id={task._id} title={task.title} description={task.description} tags={task.tags} priority={task.priority} date={formatDate(task.createdAt)} onDelete={handleDelete} /> )
                    }
                  </div>
            }
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Tasks;