import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import Container from "@/components/Container"

const Settings = () => {
  return (
    <div className="w-full h-full flex">
      <Sidebar route={'settings'} />
      <div className="flex-1 h-full bg-zinc-100">
          <Navbar tab="Settings" />
          <Container>
            <div className="w-full h-full bg-white rounded-xl"></div>
          </Container>
      </div>
    </div>
  )
}

export default Settings