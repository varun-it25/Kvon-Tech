import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import Container from "@/components/Container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCookies } from "react-cookie"

const CreateTask = () => {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const [priority, setPriority] = useState<string>("")

  const [isCreating, setCreating] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)

  const nav = useNavigate()
  const [cookie] = useCookies(["session"])

  function reset() {
    setTitle("")
    setDescription("")
    setTags([])
    setTagInput("")
    setPriority("")
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const createHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError("")

    try {
      await axios.post("http://localhost:5000/tasks/create",
        { title, description, priority, tags },
        { headers: { token: cookie.session } }
      )
      setCreating(false)
      reset()
      setSuccess(true)
      nav("/tasks")
    } catch (err: any) {
      setCreating(false)
      setError(err?.response?.data?.message || "Something went wrong")
    }
  }

  const addTag = (e: React.MouseEvent) => {
    e.preventDefault()
    if (tagInput.trim() !== "") {
      setTags((prevTags) => [tagInput.trim(), ...prevTags])
      setTagInput("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="w-full h-full flex">
      <Sidebar route={"tasks"} />
      <div className="flex-1 flex flex-col h-full bg-zinc-100 relative overflow-auto">
        <Navbar tab="Create Task" />

        {error !== "" && (
          <Container>
            <div className="w-full flex-1 flex justify-center items-center">
              <div className="w-96 p-8 bg-white rounded-xl mb-[4rem] space-y-2">
                <p className="text-red-500 font-bold text-xl">Error</p>
                <p className="text-zinc-400">{error}</p>
              </div>
            </div>
          </Container>
        )}

        {success && (
          <Container>
            <div className="w-full flex-1 flex justify-center items-center">
              <div className="w-96 p-8 bg-white rounded-xl mb-[4rem] space-y-2">
                <p className="text-green-500 font-bold text-xl">Success!</p>
                <p className="text-zinc-400">Your task is created successfully.</p>
              </div>
            </div>
          </Container>
        )}

        {!success && error === "" && (
          <Container>
            <div className="w-full bg-white rounded-xl space-y-6 p-8">
              <p className="font-semibold ml-[-2px] text-sm px-4 py-2 bg-sky-100 w-fit rounded-full">Task Details</p>

              <form className="space-y-4" onSubmit={createHandler}>
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
                  <div className="flex justify-between items-center space-x-4">
                    <Input onChange={(e) => setTagInput(e.target.value)} value={tagInput} />
                    <Button variant={"ghost"} onClick={addTag}>
                      <Plus className="mr-1" size={16} /> Add
                    </Button>
                  </div>
                </div>

                <div className="flex items-center scrollbar pb-2 space-x-3 mt-[-0.3rem] overflow-auto">
                  {
                    tags.length === 0
                      ? <p className="text-xs text-zinc-400 font-medium px-1">There are no tags.</p>
                      : tags.map((tag, index) => (
                          <div key={index} className="px-3 py-1 text-nowrap bg-zinc-100 text-[10px] font-medium rounded flex items-center space-x-1">
                              <p>{tag}</p>
                              <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeTag(index)} />
                          </div>
                        ))
                  }
                </div>

                <div className="space-y-1.5 text-sm font-medium text-zinc-600 pt-2">
                  <p>Priority</p>
                  <Select onValueChange={(value) => setPriority(value)} required>
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

                {
                  isCreating
                    ? <Button className="mt-4 w-full" disabled>Creating <Loader2 className="animate-spin ml-2" size={16} /></Button>
                    : <Button className="mt-4 w-full">Create</Button>
                }
              </form>
            </div>
          </Container>
        )}
      </div>
    </div>
  )
}

export default CreateTask