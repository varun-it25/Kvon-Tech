import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

interface TaskData {
  title: string;
  description: string;
  tags: string[];
  priority: string;
}

const UpdateTask = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  const [isUpdating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [cookie] = useCookies(["session"]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get<TaskData>(`http://localhost:5000/tasks/${id}`, {  headers: {token: cookie.session} });
        const { title, description, tags, priority } = response.data;
        setTitle(title);
        setDescription(description);
        setTags(tags);
        setPriority(priority);
      } catch (err) {
        setError("Task does not exist or could not be fetched.");
      }
    };

    if (id) fetchTask();
  }, [id, cookie.session]);

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() !== "") {
      setTags((prev) => [tagInput.trim(), ...prev]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
  };

  const updateHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`,
        { title, description, priority, tags },
        { headers: { token: cookie.session } }
      );
      setUpdating(false);
      setSuccess(true);
      setTimeout(() => {
        nav("/tasks");
      }, 1000)
    } catch (err: any) {
      setUpdating(false);
      setError(err?.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="w-full h-full flex">
      <Sidebar route="tasks" />
      <div className="flex-1 flex flex-col h-full bg-zinc-100 relative overflow-auto">
        <Navbar tab="Update Task" />
        {error || success ? (
          <Container>
            <div className="w-full flex-1 flex justify-center items-center">
              <div className="w-96 p-8 bg-white rounded-xl mb-[4rem] space-y-2">
                {success ? (
                  <>
                    <p className="text-green-500 font-bold text-xl">Success!</p>
                    <p className="text-zinc-400">Your task was updated successfully.</p>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 font-bold text-xl">Error</p>
                    <p className="text-zinc-400">{error}</p>
                  </>
                )}
              </div>
            </div>
          </Container>
        ) : (
          <Container>
            <div className="w-full bg-white rounded-xl space-y-6 p-8">
              <p className="font-semibold ml-[-2px] text-sm px-4 py-2 bg-sky-100 w-fit rounded-full">Task Details</p>

              <form className="space-y-4" onSubmit={updateHandler}>
                <div className="space-y-1.5 text-sm font-medium text-zinc-600">
                  <p>Title</p>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-1.5 text-sm font-medium text-zinc-600">
                  <p>Description</p>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="space-y-1.5 text-sm font-medium text-zinc-600">
                  <p>Tags</p>
                  <div className="flex items-center space-x-4">
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
                    <Button variant="ghost" onClick={addTag}><Plus className="mr-1" />Add</Button>
                  </div>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    {
                      tags.length === 0
                        ? <p className="text-xs text-zinc-400">No tags added.</p>
                        : tags.map((tag, idx) => (
                            <div key={idx} className="px-3 py-1 bg-zinc-100 text-[10px] font-medium rounded flex items-center space-x-1" >
                              <p>{tag}</p>
                              <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeTag(idx)} />
                            </div>
                          ))
                    }
                  </div>
                </div>

                <div className="space-y-1.5 text-sm font-medium text-zinc-600 pt-2">
                  <p>Priority</p>
                  <Select value={priority} onValueChange={(val) => setPriority(val)}>
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="mt-4 w-full cursor-pointer" disabled={isUpdating}>{ isUpdating ?<>Updating <Loader2 className="animate-spin ml-2" size={16} /></> :"Update" }</Button>
              </form>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
};

export default UpdateTask;