const KV_REST_API_URL = process.env.KV_REST_API_URL;

type Message = {
  id: number;
  content: string;
  created_at: string;
};

type State = {
  last_activity: string | null;
  messages: Message[];
  next_id: number;
};

const DEFAULT_STATE: State = { 
  last_activity: new Date().toISOString(), 
  messages: [],
  next_id: 1
};

async function getState(): Promise<State> {
  if (!KV_REST_API_URL) return DEFAULT_STATE;
  try {
    const res = await fetch(`${KV_REST_API_URL}/state`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return DEFAULT_STATE; // key doesn't exist yet
      return DEFAULT_STATE;
    }
    const data = await res.json();
    return data as State;
  } catch (err) {
    console.error('Error reading from KV:', err);
    return DEFAULT_STATE;
  }
}

async function saveState(state: State) {
  if (!KV_REST_API_URL) return;
  try {
    await fetch(`${KV_REST_API_URL}/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (err) {
    console.error('Error writing to KV:', err);
  }
}

const db = {
  async getLastActivity() {
    const state = await getState();
    return state.last_activity;
  },
  
  async clearMessagesAndResetTimer() {
    const state = await getState();
    state.messages = [];
    state.last_activity = new Date().toISOString();
    await saveState(state);
  },
  
  async getRecentMessages(limit = 9) {
    const state = await getState();
    return state.messages.sort((a, b) => b.id - a.id).slice(0, limit);
  },
  
  async addMessage(content: string) {
    const state = await getState();
    const newMessage: Message = {
      id: state.next_id++,
      content,
      created_at: new Date().toISOString(),
    };
    state.messages.push(newMessage);
    state.last_activity = new Date().toISOString();
    await saveState(state);
  }
};

export default db;
