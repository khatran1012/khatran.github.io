export type JourneyPoint = [number, number, number];

export interface JourneyNode {
  id: string;
  label: string;
  title: string;
  description: string;
  position: [number, number];
}

export interface JourneyMotion {
  progress: number;
  velocity: number;
  updatedAt: number;
  interactionAt: number;
  yaw: number;
  pitch: number;
  pointerX: number;
  pointerY: number;
  focusDistance: number;
  selectedNode: string | null;
  hoveredNode: string | null;
}

export const JOURNEY_PHASES = ['Overview', 'Design', 'Logic', 'Bridge', 'Persistence', 'System'];
// The final scroll interval reconnects the boards after visiting all five layers.
export const JOURNEY_SCROLL_STEPS = JOURNEY_PHASES.length;

export const BOARD_POSITIONS: JourneyPoint[] = [[-2.8, 0, 0], [2.8, 0.35, -4.8], [-2.8, -0.2, -9.6], [2.8, 0.15, -14.4], [-2.8, 0.8, -19.2]];
export const ASSEMBLED_POSITIONS: JourneyPoint[] = [[-3.7, 1.9, -2.5], [-3.4, -1.55, -3.8], [0.1, 2, -5], [3.6, 1.8, -3.8], [3.4, -1.7, -2.5]];

export const JOURNEY_NODES: JourneyNode[][] = [
  [
    { id: 'ui', label: 'UI', title: 'User interface', description: 'React and TypeScript project application state into reusable operational screens. User events flow into the Logic layer.', position: [-1.25, 0.65] },
    { id: 'input', label: 'INPUT', title: 'Input & feedback', description: 'Forms, validation and clear loading states connect user intent to the next application action.', position: [-1.15, -0.65] },
    { id: 'a11y', label: 'A11Y', title: 'Accessible interaction', description: 'Keyboard controls, readable contrast and responsive layouts keep workflows available across devices.', position: [1.3, 0.5] },
  ],
  [
    { id: 'state', label: 'STATE', title: 'Application state', description: 'Redux, NgRx and RxJS coordinate shared state across commerce and enterprise workflows.', position: [-1.25, 0.65] },
    { id: 'effects', label: 'ASYNC', title: 'Asynchronous effects', description: 'API responses and user actions update explicit UI states. Cancellation and request ownership keep stale responses from replacing newer results.', position: [-1.15, -0.65] },
    { id: 'rules', label: 'REDUCER', title: 'Pure state transitions', description: 'Reducers compute the next state from the current state and an action. Effects handle asynchronous work and dispatch result actions; selectors project state into views. Durable financial and inventory rules remain enforced by backend services.', position: [1.3, 0.5] },
  ],
  [
    { id: 'rest', label: 'API', title: 'REST / OpenAPI', description: 'Golang and Gin expose validated API contracts between operational portals, OTA partners and backend services.', position: [-1.25, 0.65] },
    { id: 'mqtt', label: 'MQTT', title: 'Device messaging', description: 'MQTT carries gateway events and synchronization messages between central services and on-site devices.', position: [-1.15, -0.65] },
    { id: 'partners', label: 'OTA', title: 'Partner boundary', description: 'OTA, payment and commerce integrations adapt external contracts without exposing internal implementation details.', position: [1.3, 0.5] },
  ],
  [
    { id: 'postgres', label: 'DB', title: 'PostgreSQL / SQLC', description: 'Parameterized queries, transactions and row locks protect durable order, ticket and inventory state under concurrent requests.', position: [-1.25, 0.65] },
    { id: 'redis', label: 'REDIS', title: 'Redis coordination', description: 'Caching and distributed coordination support services while PostgreSQL remains responsible for durable transactional integrity.', position: [-1.15, -0.65] },
    { id: 'events', label: 'EVENT', title: 'Synchronization events', description: 'Committed changes produce events for downstream consumers. Retries and reconciliation account for interrupted delivery.', position: [1.3, 0.5] },
  ],
  [
    { id: 'cache', label: 'CACHE', title: 'Local edge state', description: 'A local ticket snapshot supports on-site validation during WAN interruptions, with later reconciliation against central state.', position: [-1.25, 0.65] },
    { id: 'gate', label: 'GATE', title: 'Physical access', description: 'Gateways connect scanners and turnstiles to the ticket validation workflow. Physical admission is coordinated with recorded usage.', position: [-1.15, -0.65] },
    { id: 'sync', label: 'SYNC', title: 'Gateway synchronization', description: 'Deferred events return through MQTT when connectivity recovers, completing the connection between physical access and central services.', position: [1.3, 0.5] },
  ],
];

export const JOURNEY_CONNECTIONS = [
  { from: 0, fromNode: 0, to: 1, toNode: 0, label: 'UI events → application state' },
  { from: 1, fromNode: 2, to: 2, toNode: 0, label: 'Validated workflow → service API' },
  { from: 2, fromNode: 0, to: 3, toNode: 0, label: 'Service transaction → durable state' },
  { from: 3, fromNode: 2, to: 4, toNode: 0, label: 'Committed changes → edge snapshot' },
  { from: 4, fromNode: 2, to: 2, toNode: 1, label: 'Gateway events → MQTT synchronization' },
];
