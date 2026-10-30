import { useMemo, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, Bell, Bot, Brain, Check, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Code2, Command, FileText, FolderOpen,
  Globe2, LayoutDashboard, Menu, MessageSquare, MoreHorizontal, Plus,
  Search, Send, Settings, ShieldCheck, Sparkles, SquarePen, Wrench, X,
  Zap, CalendarClock, Database, PanelLeftClose, Paperclip, Play, Pause,
  CircleDot, LockKeyhole, LogOut, UserRound, SlidersHorizontal
} from "lucide-react";

type Page = "Overview" | "AI Chat" | "Agent Tasks" | "Research" | "Files" | "Automations" | "Memory" | "Tools Center" | "Activity Log" | "Settings";
const nav: { label: Page; icon: React.ElementType; group: string }[] = [
  { label: "Overview", icon: LayoutDashboard, group: "WORKSPACE" },
  { label: "AI Chat", icon: MessageSquare, group: "WORKSPACE" },
  { label: "Agent Tasks", icon: Bot, group: "WORKSPACE" },
  { label: "Research", icon: Globe2, group: "WORKSPACE" },
  { label: "Files", icon: FolderOpen, group: "WORKSPACE" },
  { label: "Automations", icon: CalendarClock, group: "MANAGE" },
  { label: "Memory", icon: Brain, group: "MANAGE" },
  { label: "Tools Center", icon: Wrench, group: "MANAGE" },
  { label: "Activity Log", icon: Activity, group: "MANAGE" },
  { label: "Settings", icon: Settings, group: "SYSTEM" }
];

const tasks = [
  { name: "Compare AI model providers", detail: "Research · 4 steps", status: "Completed", time: "12 min ago", pct: 100 },
  { name: "Prepare product launch brief", detail: "Writing · 6 steps", status: "Running", time: "Running now", pct: 64 },
  { name: "Review uploaded project notes", detail: "Files · 3 steps", status: "Waiting", time: "Queued", pct: 0 }
];

function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("All tasks");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const title = useMemo(() => page === "Overview" ? "Good afternoon" : page, [page]);

  const submitPrompt = () => {
    if (!prompt.trim()) return;
    setChatStarted(true);
    notify("Demo UI only — AI connection is not configured yet.");
    setPrompt("");
  };

  const navigate = (p: Page) => { setPage(p); setSidebarOpen(false); };

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={21} /></div>
          <div><strong>AI AGENT <span>171</span></strong><small>YOUR AI WORKSPACE</small></div>
          <button className="icon-btn sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close"><X size={17}/></button>
        </div>
        <button className="workspace-switch" onClick={() => notify("Workspace switching will be added later.")}>
          <div className="workspace-avatar">171</div>
          <div className="workspace-name"><b>Personal Workspace</b><small>Free workspace</small></div>
          <ChevronDown size={15} />
        </button>
        <button className="new-task" onClick={() => navigate("AI Chat")}><Plus size={17}/> New task <span>⌘ K</span></button>
        <nav className="nav-list">
          {["WORKSPACE", "MANAGE", "SYSTEM"].map(group => (
            <div className="nav-group" key={group}>
              <div className="nav-heading">{group}</div>
              {nav.filter(item => item.group === group).map(item => {
                const Icon = item.icon;
                return <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} onClick={() => navigate(item.label)}>
                  <Icon size={17}/><span>{item.label}</span>
                  {item.label === "Agent Tasks" && <i className="nav-count">3</i>}
                </button>;
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="usage-card">
            <div className="usage-top"><span>Monthly usage</span><span>Demo</span></div>
            <div className="usage-track"><i /></div>
            <small>Connect an AI provider to track usage.</small>
          </div>
          <button className="profile-row" onClick={() => navigate("Settings")}>
            <div className="profile-avatar">U</div><div><b>Your account</b><small>Google sign-in planned</small></div><MoreHorizontal size={17}/>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
            <div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div>
          </div>
          <div className="top-actions">
            <div className="connection-pill"><i/> UI preview</div>
            <button className="icon-btn" onClick={() => notify("No new notifications in this preview.")} aria-label="Notifications"><Bell size={18}/></button>
            <button className="help-btn" onClick={() => notify("Help center will be added later.")}><CircleHelp size={17}/> Help</button>
          </div>
        </header>

        <div className="content">
          {page === "Overview" && <Overview navigate={navigate} notify={notify}/>}
          {page === "AI Chat" && <Chat prompt={prompt} setPrompt={setPrompt} submit={submitPrompt} started={chatStarted}/>}
          {page === "Agent Tasks" && <Tasks filter={filter} setFilter={setFilter}/>}
          {page === "Research" && <GenericPage icon={Globe2} title="Research workspace" desc="Collect sources, compare information, and turn findings into clear reports." cards={["Web search","Source comparison","Research reports"]}/>}
          {page === "Files" && <GenericPage icon={FileText} title="Your files" desc="A central space for documents and files used by your agent." cards={["Documents","Spreadsheets","Generated reports"]}/>}
          {page === "Automations" && <GenericPage icon={CalendarClock} title="Automations" desc="Plan recurring tasks and scheduled agent runs. Scheduling is not connected in this preview." cards={["Daily research digest","Weekly project summary","Scheduled reminders"]}/>}
          {page === "Memory" && <GenericPage icon={Brain} title="Agent memory" desc="Review the information and project context the agent may use in future tasks." cards={["Saved preferences","Project context","Conversation memory"]}/>}
          {page === "Tools Center" && <Tools/>}
          {page === "Activity Log" && <GenericPage icon={Activity} title="Activity log" desc="A transparent record of tasks, tool calls, approvals, and outcomes." cards={["Task created","Workspace opened","Preview loaded"]}/>}
          {page === "Settings" && <SettingsPage notify={notify}/>}
        </div>
        <footer className="footer"><span>AI AGENT 171</span><span>Autonomous AI Workspace <i/> Stage 1 · Interface preview</span></footer>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function PageHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: React.ReactNode }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
}

function Overview({ navigate, notify }: { navigate: (p: Page) => void; notify: (s: string) => void }) {
  return <>
    <PageHead eyebrow="PERSONAL WORKSPACE" title="Good afternoon" desc="Your AI workspace is ready. What would you like to work on today?" action={<button className="gold-btn" onClick={() => navigate("AI Chat")}><Plus size={17}/> New task</button>}/>
    <div className="hero-card">
      <div className="hero-orb"><div className="orb-core"><Sparkles size={30}/></div><i className="orbit orbit-one"/><i className="orbit orbit-two"/></div>
      <div className="hero-copy"><div className="hero-label"><span/> YOUR AGENT WORKSPACE</div><h2>Make your ideas<br/><em>happen with AI.</em></h2><p>Give your agent a goal. It can plan the steps, use connected tools, and report back when the work is done.</p><button className="hero-btn" onClick={() => navigate("AI Chat")}>Start a task <ArrowRight size={16}/></button></div>
      <div className="hero-foot"><span><ShieldCheck size={14}/> You stay in control</span><span><Zap size={14}/> Multi-step workflow ready for setup</span></div>
    </div>
    <div className="section-title"><div><h2>Workspace overview</h2><p>A quick look at your agent workspace</p></div><button className="text-btn" onClick={() => navigate("Agent Tasks")}>View all tasks <ArrowRight size={15}/></button></div>
    <div className="stats-grid">
      <Stat icon={Bot} label="Total tasks" value="03" note="Sample workspace data"/>
      <Stat icon={Activity} label="In progress" value="01" note="Demo status"/>
      <Stat icon={CheckCircle2} label="Completed" value="01" note="Demo status"/>
      <Stat icon={Wrench} label="Connected tools" value="00" note="No tools connected"/>
    </div>
    <div className="lower-grid">
      <div className="panel task-panel"><div className="panel-head"><div><h3>Recent tasks</h3><p>Track what your agent is working on</p></div><button className="icon-btn" onClick={() => navigate("Agent Tasks")}><ArrowRight size={17}/></button></div>
        {tasks.map((t, i) => <div className="task-row" key={t.name}><div className={`task-icon task-${i}`}><Bot size={17}/></div><div className="task-info"><b>{t.name}</b><small>{t.detail}</small><div className="progress"><i style={{width: `${t.pct}%`}}/></div></div><div className={`status status-${t.status.toLowerCase()}`}>{t.status}</div></div>)}
      </div>
      <div className="panel quick-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Jump into your workspace</p></div></div>
        <Quick icon={MessageSquare} title="Start a conversation" desc="Ask your AI assistant" onClick={() => navigate("AI Chat")}/>
        <Quick icon={Globe2} title="Research a topic" desc="Explore information online" onClick={() => navigate("Research")}/>
        <Quick icon={FolderOpen} title="Browse your files" desc="Review your workspace files" onClick={() => navigate("Files")}/>
        <Quick icon={Wrench} title="Explore tools" desc="Manage agent capabilities" onClick={() => navigate("Tools Center")}/>
      </div>
    </div>
    <div className="notice"><ShieldCheck size={18}/><div><b>Designed with your control in mind</b><span>External actions, messages, purchases, and destructive changes will require your approval when execution is implemented.</span></div><button onClick={() => notify("Approval controls are planned for the Agent milestone.")}>Learn more</button></div>
  </>;
}

function Stat({ icon: Icon, label, value, note }: any) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={17}/></div><strong>{value}</strong><small>{note}</small></div>;
}
function Quick({ icon: Icon, title, desc, onClick }: any) {
  return <button className="quick-row" onClick={onClick}><div className="quick-icon"><Icon size={17}/></div><div><b>{title}</b><small>{desc}</small></div><ArrowRight size={15}/></button>;
}

function Chat({ prompt, setPrompt, submit, started }: any) {
  return <>
    <PageHead eyebrow="AI ASSISTANT" title="AI Chat" desc="Talk through ideas, ask questions, or give your agent a goal."/>
    <div className="chat-layout">
      <div className="chat-main panel">
        <div className="chat-toolbar"><div className="model-indicator"><span className="model-dot"/><b>AI Provider</b><small>Not connected</small><ChevronDown size={14}/></div><button className="icon-btn" title="New conversation"><SquarePen size={17}/></button></div>
        <div className="chat-empty">
          <div className="chat-mark"><Sparkles size={25}/></div><div className="eyebrow">AI AGENT 171</div><h2>{started ? "Preview interaction" : "What can I help you with?"}</h2><p>{started ? "Your message was entered in the interface. Connect an AI provider in a later milestone to receive a real response." : "Start with a question or describe an outcome you want to achieve."}</p>
          <div className="suggestions"><button onClick={() => setPrompt("Research the latest AI developments and summarize the findings.")}><Globe2 size={15}/> Research a topic</button><button onClick={() => setPrompt("Help me plan a new project from start to finish.")}><Command size={15}/> Plan a project</button><button onClick={() => setPrompt("Review this project and suggest improvements.")}><Code2 size={15}/> Review my work</button></div>
        </div>
        <div className="composer"><div className="composer-box"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Message AI Agent 171..." rows={2}/><div className="composer-actions"><button className="icon-btn" title="Attach file (not active yet)"><Paperclip size={17}/></button><span>Enter to send · Shift + Enter for new line</span><button className="send-btn" onClick={submit} disabled={!prompt.trim()}><Send size={16}/></button></div></div><small>Preview mode · AI responses are not connected yet.</small></div>
      </div>
      <aside className="chat-side"><div className="panel side-card"><h3>Agent mode</h3><p>Let your agent plan and execute multi-step tasks.</p><div className="mode-pill"><CircleDot size={14}/> Not configured</div><button className="outline-btn" disabled>Configure agent</button></div><div className="panel side-card"><h3>Conversation context</h3><div className="context-line"><Brain size={16}/><span>Memory</span><b>Not connected</b></div><div className="context-line"><Wrench size={16}/><span>Tools</span><b>0 connected</b></div><div className="context-line"><ShieldCheck size={16}/><span>Approvals</span><b>Planned</b></div></div></aside>
    </div>
  </>;
}

function Tasks({ filter, setFilter }: any) {
  const filtered = tasks.filter(t => filter === "All tasks" || t.status === filter);
  return <>
    <PageHead eyebrow="AUTONOMOUS WORKSPACE" title="Agent Tasks" desc="Monitor task progress, review outcomes, and manage your agent's workload." action={<button className="gold-btn" disabled><Plus size={17}/> New task</button>}/>
    <div className="stats-grid compact"><Stat icon={LayersIcon} label="All tasks" value="03" note="Sample data"/><Stat icon={Play} label="Running" value="01" note="Sample data"/><Stat icon={Clock3} label="Waiting" value="01" note="Sample data"/><Stat icon={CheckCircle2} label="Completed" value="01" note="Sample data"/></div>
    <div className="panel list-panel"><div className="list-toolbar"><div className="filter-tabs">{["All tasks","Running","Waiting","Completed"].map(f=><button className={filter===f?"selected":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><button className="outline-btn"><SlidersHorizontal size={15}/> Filters</button></div>
      {filtered.map((t,i)=><div className="large-task" key={t.name}><div className="task-icon"><Bot size={18}/></div><div className="large-task-main"><b>{t.name}</b><small>{t.detail} · {t.time}</small><div className="progress wide"><i style={{width:`${t.pct}%`}}/></div></div><span className={`status status-${t.status.toLowerCase()}`}>{t.status}</span><button className="icon-btn"><MoreHorizontal size={18}/></button></div>)}
      {!filtered.length && <div className="empty-state">No tasks in this category.</div>}
    </div>
  </>;
}
function LayersIcon(props: any) { return <Database {...props}/>; }

function GenericPage({ icon: Icon, title, desc, cards }: any) {
  return <>
    <PageHead eyebrow="WORKSPACE MODULE" title={title} desc={desc}/>
    <div className="module-banner"><div className="module-icon"><Icon size={24}/></div><div><b>{title} module</b><p>This screen is part of the Stage 1 interface foundation. Its live service will be connected in a later milestone.</p></div><span className="coming">UI READY</span></div>
    <div className="module-grid">{cards.map((c: string, i: number)=><div className="panel module-card" key={c}><div className="module-card-icon">{[<Search/>,<FileText/>,<Sparkles/>][i]}</div><b>{c}</b><p>Workspace area prepared for future implementation.</p><span className="coming">NOT CONNECTED</span></div>)}</div>
  </>;
}

function Tools() {
  const toolItems = [
    {icon: Globe2, name:"Web Search", desc:"Search the public web and discover useful sources", tag:"Research"},
    {icon: FileText, name:"Document Reader", desc:"Extract and analyze text from supported files", tag:"Files"},
    {icon: Code2, name:"Code Workspace", desc:"Work with code in a controlled environment", tag:"Development"},
    {icon: Database, name:"Database Connector", desc:"Connect approved data sources", tag:"Data"},
    {icon: CalendarClock, name:"Task Scheduler", desc:"Create recurring and scheduled tasks", tag:"Automation"},
    {icon: MessageSquare, name:"External Messaging", desc:"Prepare messages for connected services", tag:"Communication"}
  ];
  return <>
    <PageHead eyebrow="CAPABILITIES" title="Tools Center" desc="Explore the tools your agent can use. Connections and permissions will be implemented in a later milestone."/>
    <div className="tools-toolbar"><div className="search-box"><Search size={16}/><input placeholder="Search tools..." /></div><button className="outline-btn"><SlidersHorizontal size={15}/> Categories</button></div>
    <div className="tools-grid">{toolItems.map((t,i)=>{const Icon=t.icon;return <div className="panel tool-card" key={t.name}><div className="tool-card-top"><div className="tool-icon"><Icon size={19}/></div><span className="coming">AVAILABLE LATER</span></div><b>{t.name}</b><p>{t.desc}</p><div className="tool-card-bottom"><span>{t.tag}</span><button disabled>Connect <Plus size={14}/></button></div></div>})}</div>
  </>;
}

function SettingsPage({ notify }: any) {
  return <>
    <PageHead eyebrow="PREFERENCES" title="Settings" desc="Manage your account, AI providers, workspace preferences, and security."/>
    <div className="settings-layout"><div className="settings-menu panel">{["Profile","AI Providers","Appearance","Security & Privacy","Notifications"].map((x,i)=><button className={i===0?"chosen":""} key={x}><span>{[<UserRound/>,<Brain/>,<Sparkles/>,<LockKeyhole/>,<Bell/>][i]}</span>{x}<ArrowRight size={14}/></button>)}</div>
      <div className="panel settings-content"><div className="settings-section"><div className="settings-avatar">U</div><div><h3>Account profile</h3><p>Google account connection will be implemented in the authentication milestone.</p></div></div><div className="setting-row"><div><b>Sign-in method</b><small>Google Login only</small></div><span className="coming">NOT CONNECTED</span></div><div className="setting-row"><div><b>AI provider preferences</b><small>Cloud API and local model support planned</small></div><button className="outline-btn" onClick={()=>notify("Provider settings are planned for M2.")}>Configure</button></div><div className="setting-row"><div><b>Appearance</b><small>Dark theme with gold accents</small></div><span className="mode-pill">Active</span></div></div>
    </div>
  </>;
}

export default App;