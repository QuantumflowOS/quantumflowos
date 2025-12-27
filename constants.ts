import { Client, Priority, Ticket, TicketStatus, Invoice, NetworkAsset, ClientContact, ClientDocument, ScheduleEvent, User, PricingPlan, Product, Article, M365User, M365ServiceHealth, ConfigBackup, Subnet, ThirdPartyService } from './types';

// Data strictly aligned with NetServe SA Target Market
export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'SwiftMove Logistics HQ', 
    industry: 'Logistics',
    location: 'Kempton Park, Gauteng', 
    status: 'Online', 
    devices: 145, 
    lastPing: '4ms', 
    connectionType: 'Metro Fiber Ring',
    slaTier: 'Gold',
    phoneNumber: '+27 83 555 1234',
    outstandingBalance: 0,
    primaryContact: 'Sarah Jenkins',
    email: 'ops@swiftmove.co.za',
    address: '14 Cargo Road, OR Tambo Industrial',
    accountManager: 'Juan-louw G.'
  },
  { 
    id: 'c2', 
    name: 'MediCare Family Clinic', 
    industry: 'Healthcare',
    location: 'Pretoria East', 
    status: 'Degraded', 
    devices: 32, 
    lastPing: '189ms', 
    connectionType: 'Business Broadband',
    slaTier: 'Silver',
    phoneNumber: '+27 82 999 8888',
    outstandingBalance: 4500.00,
    primaryContact: 'Dr. Piet Nel',
    email: 'admin@medicare.co.za',
    address: '44 Garsfontein Road, Pretoria',
    accountManager: 'Thabo M.'
  },
  { 
    id: 'c3', 
    name: 'Connect24 Call Centre', 
    industry: 'BPO / Call Center',
    location: 'Umhlanga Ridge', 
    status: 'Offline', 
    devices: 250, 
    lastPing: 'Timeout', 
    connectionType: 'Dedicated DIA 1Gbps',
    slaTier: 'Platinum',
    phoneNumber: '+27 82 123 4567',
    outstandingBalance: 125000.50,
    primaryContact: 'Raj Naidoo',
    email: 'tech@connect24.co.za',
    address: '12 Palm Blvd, Umhlanga',
    accountManager: 'Juan-louw G.'
  },
  { 
    id: 'c4', 
    name: 'Balance Sheet Pro', 
    industry: 'Financial Services',
    location: 'Cape Town CBD', 
    status: 'Online', 
    devices: 18, 
    lastPing: '8ms', 
    connectionType: 'Fiber 200Mbps',
    slaTier: 'Bronze',
    phoneNumber: '+27 21 444 5555',
    outstandingBalance: 0,
    primaryContact: 'Michelle Du Preez',
    email: 'accounts@bsp.co.za',
    address: '2 Long Street, Cape Town',
    accountManager: 'Thabo M.'
  },
  { 
    id: 'c5', 
    name: 'Urban Mart Retail Group', 
    industry: 'Retail',
    location: 'Sandton City', 
    status: 'Degraded', 
    devices: 12, 
    lastPing: '450ms', 
    connectionType: 'Enterprise 5G APN',
    slaTier: 'Gold',
    phoneNumber: '+27 11 883 1234',
    outstandingBalance: 0,
    primaryContact: 'Sipho Khumalo',
    email: 'store.mgr@urbanmart.co.za',
    address: 'Shop U45, Sandton City',
    accountManager: 'Juan-louw G.'
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Juan-louw Greyling',
    email: 'admin@netserve.co.za',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=juan'
  },
  {
    id: 'u2',
    name: 'Thabo Moloi',
    email: 'thabo@netserve.co.za',
    role: 'technician',
    avatar: 'https://i.pravatar.cc/150?u=thabo'
  },
  {
    id: 'u3',
    name: 'Sarah Jenkins',
    email: 'ops@swiftmove.co.za',
    role: 'customer',
    clientId: 'c1', // SwiftMove
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2023-001',
    clientId: 'c3',
    clientName: 'Connect24 Call Centre',
    amount: 125000.50,
    status: 'Overdue',
    dueDate: '2023-10-01',
    items: ['Managed Voice Services (Sept)', 'Dedicated Fiber Lease', 'SLA Support Fee']
  },
  {
    id: 'INV-2023-002',
    clientId: 'c2',
    clientName: 'MediCare Family Clinic',
    amount: 4500.00,
    status: 'Unpaid',
    dueDate: '2023-10-25',
    items: ['SLA Silver Monthly Retainer']
  },
  {
    id: 'INV-2023-003',
    clientId: 'c1',
    clientName: 'SwiftMove Logistics HQ',
    amount: 15000.00,
    status: 'Paid',
    dueDate: '2023-10-15',
    items: ['Metro Fiber Ring Lease', 'Gold Support']
  }
];

export const MOCK_TICKETS: Ticket[] = [
  { 
    id: 'NET-1001', 
    clientId: 'c3', 
    clientName: 'Connect24 Call Centre',
    clientSla: 'Platinum',
    title: 'Total VoIP Service Outage', 
    description: 'SIP Trunks failing registration. PBX reporting 503 Service Unavailable. 250 Agents affected.', 
    status: TicketStatus.OPEN, 
    priority: Priority.CRITICAL, 
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), 
    assignedTo: 'Automated Agent',
    automationStatus: 'idle'
  },
  { 
    id: 'NET-1002', 
    clientId: 'c2', 
    clientName: 'MediCare Family Clinic',
    clientSla: 'Silver',
    title: 'Patient Database Slow Access', 
    description: 'Cloud EMR (Electronic Medical Records) timing out. High latency detected on gateway.', 
    status: TicketStatus.IN_PROGRESS, 
    priority: Priority.HIGH, 
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    assignedTo: 'Thabo M.',
    automationStatus: 'idle'
  },
];

export const SYSTEM_PROMPT = `You are the NetServe SA AI Technician Assistant. 
Your role is to assist network engineers managing specific client sectors: Logistics, Healthcare, Retail, and Call Centers.
Context:
- Infrastructure: Mixed Fiber (Metro/Long-haul), Microwave, and Enterprise 5G APNs.
- Common issues: Power failures (UPS battery depletion), Fiber cuts, Route flapping, DNS latency.
- Tone: Professional, concise, technical (Tier 2/3 level).
- When suggesting fixes, assume access to standard Cisco IOS, Mikrotik RouterOS, or Linux-based tools.
Always answer in short, actionable bullet points when diagnosing.`;

// --- NEW CRM MOCK DATA ---

export const MOCK_ASSETS: NetworkAsset[] = [
  { 
      id: 'a1', 
      clientId: 'c1', 
      name: 'Core Router', 
      type: 'Router', 
      model: 'MikroTik CCR1036', 
      ipAddress: '192.168.10.1', 
      macAddress: '00:0C:42:XX:XX:XX', 
      serial: 'MK-998877', 
      firmware: 'v7.11', 
      status: 'Online', 
      lastSeen: 'Just now',
      credentials: { username: 'admin', passwordHash: '******', port: 80 }
  },
  { 
      id: 'a2', 
      clientId: 'c1', 
      name: 'Warehouse Switch', 
      type: 'Switch', 
      model: 'Ubiquiti EdgeSwitch 48', 
      ipAddress: '192.168.10.2', 
      macAddress: '74:83:C2:XX:XX:XX', 
      serial: 'UI-223344', 
      firmware: 'v1.9.0', 
      status: 'Online', 
      lastSeen: '1 min ago',
      credentials: { username: 'ubnt', passwordHash: '******', port: 443 }
  },
  { 
      id: 'a3', 
      clientId: 'c3', 
      name: 'Voice Gateway', 
      type: 'Router', 
      model: 'Cisco ISR 4331', 
      ipAddress: '10.10.50.1', 
      macAddress: '00:A0:C9:XX:XX:XX', 
      serial: 'FGL223344', 
      firmware: 'IOS-XE 17.3', 
      status: 'Offline', 
      lastSeen: '15 mins ago',
      credentials: { username: 'cisco', passwordHash: '******', port: 443 }
  },
  { 
      id: 'a4', 
      clientId: 'c2', 
      name: 'Firewall', 
      type: 'Firewall', 
      model: 'FortiGate 60F', 
      ipAddress: '172.16.0.1', 
      macAddress: '00:09:0F:XX:XX:XX', 
      serial: 'FG60F-1122', 
      firmware: 'v7.0.5', 
      status: 'Warning', 
      lastSeen: '2 mins ago',
      credentials: { username: 'admin', passwordHash: '******', port: 4443 }
  },
];

export const MOCK_CONTACTS: ClientContact[] = [
  { id: 'ct1', clientId: 'c1', name: 'Sarah Jenkins', role: 'Ops Manager', email: 'sarah.j@swiftmove.co.za', phone: '082 555 1111', isPrimary: true },
  { id: 'ct2', clientId: 'c1', name: 'Mike Ross', role: 'IT Lead', email: 'mike.r@swiftmove.co.za', phone: '083 444 2222', isPrimary: false },
  { id: 'ct3', clientId: 'c3', name: 'Raj Naidoo', role: 'CTO', email: 'raj@connect24.co.za', phone: '082 123 4567', isPrimary: true },
];

export const MOCK_DOCS: ClientDocument[] = [
  { id: 'd1', clientId: 'c1', name: 'SLA_Gold_Signed_2024.pdf', type: 'Contract', uploadDate: '2023-12-15', size: '2.4 MB' },
  { id: 'd2', clientId: 'c1', name: 'Network_Topology_v2.png', type: 'Diagram', uploadDate: '2024-01-10', size: '5.1 MB' },
];

export const MOCK_SCHEDULE: ScheduleEvent[] = [
  { id: 'evt1', title: 'Monthly Maintenance', technician: 'Thabo M.', clientId: 'c1', clientName: 'SwiftMove Logistics', startTime: '2024-10-25T08:00:00', endTime: '2024-10-25T10:00:00', type: 'Maintenance', status: 'Scheduled' },
  { id: 'evt2', title: 'VoIP Cutover', technician: 'Juan-louw G.', clientId: 'c3', clientName: 'Connect24', startTime: '2024-10-26T14:00:00', endTime: '2024-10-26T18:00:00', type: 'Onsite', status: 'Scheduled' },
  { id: 'evt3', title: 'Firewall Patching', technician: 'Thabo M.', clientId: 'c2', clientName: 'MediCare', startTime: '2024-10-25T11:00:00', endTime: '2024-10-25T12:00:00', type: 'Remote', status: 'Completed' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Monitoring',
    price: 699,
    slaTier: 'Bronze',
    features: ['Remote Network Health Checks', 'Email Alerts', '9x5 Support', 'Monthly Report']
  },
  {
    id: 'managed',
    name: 'Managed IT',
    price: 1499,
    slaTier: 'Silver',
    features: ['Real-time Diagnostics', 'Unlimited Remote Support', 'Router & WiFi Optimization', 'Priority Ticket Queue', '8x5 Phone Support'],
    recommended: true
  },
  {
    id: 'pro',
    name: 'Full Automation + VoIP',
    price: 2999,
    slaTier: 'Gold',
    features: ['24/7 Monitoring & AI Fixes', 'VoIP Management', 'Automated Compliance Logs', 'Designated Account Manager', 'After-hours Emergency Support']
  }
];

export const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', name: 'MikroTik CCR2004', category: 'Router', brand: 'MikroTik', price: 12500, stock: 4, description: 'Cloud Core Router with 12x 10G SFP+ ports.', image: 'https://cdn.mikrotik.com/web-assets/product/994_large.jpg' },
    { id: 'p2', name: 'Ubiquiti UniFi 6 Pro', category: 'Access Point', brand: 'Ubiquiti', price: 3499, stock: 22, description: 'High-performance WiFi 6 access point.', image: 'https://dl.ubnt.com/u6-pro-eu-box.png' },
    { id: 'p3', name: 'Ubiquiti EdgeSwitch 24 PoE', category: 'Switch', brand: 'Ubiquiti', price: 8999, stock: 8, description: 'Managed Gigabit Switch with SFP.', image: 'https://dl.ubnt.com/es-24-500w-box.png' },
    { id: 'p4', name: 'CAT6 Ethernet Cable (305m)', category: 'Cabling', brand: 'LinkBasic', price: 1850, stock: 50, description: 'Solid copper UTP cable roll.', image: 'https://m.media-amazon.com/images/I/61+yFjG6+KL.jpg' },
    { id: 'p5', name: 'FortiGate 60F License (1Yr)', category: 'License', brand: 'Fortinet', price: 5600, stock: 999, description: 'Unified Threat Management Bundle.', image: 'https://www.fortinet.com/content/dam/fortinet/images/products/fortigate-60f.png' },
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: 'art-1',
        title: 'Troubleshooting Latency on Microwave Links',
        category: 'Network',
        tags: ['latency', 'microwave', 'interference'],
        content: 'High latency on microwave links often stems from interference or misalignment. \n\n1. Check SNR levels.\n2. Verify Fresnel zone clearance.\n3. Run a spectrum analysis to identify noise.',
        author: 'Juan-louw G.',
        lastUpdated: '2024-10-15',
        views: 142
    },
    {
        id: 'art-2',
        title: 'Configuring VLANs on Mikrotik (Bridge Method)',
        category: 'SOP',
        tags: ['mikrotik', 'vlan', 'config'],
        content: 'Use the bridge VLAN filtering method for modern RouterOS versions.\n\n/interface bridge vlan\nadd bridge=bridge1 tagged=ether1 vlan-ids=10,20',
        author: 'Thabo M.',
        lastUpdated: '2024-09-22',
        views: 355
    },
    {
        id: 'art-3',
        title: 'VoIP QoS Best Practices',
        category: 'VoIP',
        tags: ['qos', 'sip', 'jitter'],
        content: 'Ensure DSCP tagging is set to 46 (EF) for voice traffic. Prioritize UDP ports 5060 and 10000-20000 in your firewall queues.',
        author: 'System',
        lastUpdated: '2024-10-01',
        views: 89
    },
    {
        id: 'art-4',
        title: 'FortiGate SSL VPN Client Setup',
        category: 'Security',
        tags: ['vpn', 'fortinet', 'remote-access'],
        content: 'Step-by-step guide to configuring FortiClient for remote users. Includes MFA setup instructions.',
        author: 'Sarah J.',
        lastUpdated: '2024-10-20',
        views: 210
    }
];

// --- M365 MOCK DATA ---
export const MOCK_M365_USERS: M365User[] = [
    { id: 'm1', displayName: 'Sarah Jenkins', userPrincipalName: 'sarah.j@swiftmove.co.za', licenses: ['Microsoft 365 Business Standard'], status: 'Active', lastLogin: '2 mins ago', department: 'Operations' },
    { id: 'm2', displayName: 'Mike Ross', userPrincipalName: 'mike.r@swiftmove.co.za', licenses: ['Microsoft 365 Business Basic'], status: 'Active', lastLogin: '2 days ago', department: 'IT' },
    { id: 'm3', displayName: 'Reception Desk', userPrincipalName: 'reception@swiftmove.co.za', licenses: ['Exchange Online P1'], status: 'Active', lastLogin: '1 hour ago', department: 'Admin' },
    { id: 'm4', displayName: 'John Doe (Terminated)', userPrincipalName: 'john.d@swiftmove.co.za', licenses: [], status: 'Blocked', lastLogin: '45 days ago', department: 'Sales' },
];

export const MOCK_M365_HEALTH: M365ServiceHealth[] = [
    { service: 'Exchange Online', status: 'Healthy', lastUpdated: '10:00 AM' },
    { service: 'Microsoft Teams', status: 'Degraded', lastUpdated: '10:45 AM' },
    { service: 'SharePoint Online', status: 'Healthy', lastUpdated: '10:00 AM' },
    { service: 'Identity Service', status: 'Healthy', lastUpdated: '10:00 AM' },
];

// --- CONFIG MOCK DATA ---
export const MOCK_BACKUPS: ConfigBackup[] = [
    {
        id: 'b-102',
        deviceId: 'a1',
        deviceName: 'Core Router',
        timestamp: 'Today, 03:00 AM',
        author: 'System (Auto)',
        changes: 0,
        content: `hostname JHB-CORE-01
!
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 description WAN_UPLINK_PRIMARY
 ip nat outside
!
interface GigabitEthernet0/1
 ip address 10.0.0.1 255.255.255.0
 description LAN_MAIN
 ip nat inside
!
router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
 network 192.168.1.0 0.0.0.255 area 0
!
ip route 0.0.0.0 0.0.0.0 192.168.1.254
!
end`
    },
    {
        id: 'b-101',
        deviceId: 'a1',
        deviceName: 'Core Router',
        timestamp: 'Yesterday, 04:30 PM',
        author: 'Thabo M.',
        changes: 2,
        content: `hostname JHB-CORE-01
!
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 description WAN_UPLINK
!
interface GigabitEthernet0/1
 ip address 10.0.0.1 255.255.255.0
 description LAN_MAIN
!
router ospf 1
 network 10.0.0.0 0.0.0.255 area 0
!
ip route 0.0.0.0 0.0.0.0 192.168.1.254
!
end`
    }
];

// --- IPAM MOCK DATA ---
export const MOCK_SUBNETS: Subnet[] = [
    { id: 'sub-1', name: 'SwiftMove HQ LAN', clientId: 'c1', cidr: '192.168.10.0/24', gateway: '192.168.10.1', vlanId: 10, utilization: 45, location: 'Kempton Park', type: 'LAN' },
    { id: 'sub-2', name: 'SwiftMove Guest WiFi', clientId: 'c1', cidr: '192.168.20.0/24', gateway: '192.168.20.1', vlanId: 20, utilization: 82, location: 'Kempton Park', type: 'LAN' },
    { id: 'sub-3', name: 'Connect24 VoIP', clientId: 'c3', cidr: '10.10.50.0/24', gateway: '10.10.50.1', vlanId: 50, utilization: 92, location: 'Umhlanga', type: 'Voice' },
    { id: 'sub-4', name: 'MediCare Servers', clientId: 'c2', cidr: '172.16.0.0/24', gateway: '172.16.0.1', vlanId: 100, utilization: 12, location: 'Pretoria', type: 'DMZ' },
];

// --- THIRD PARTY SERVICES DATA ---
export const MOCK_THIRD_PARTY_SERVICES: ThirdPartyService[] = [
    {
        id: 'tps-1',
        clientId: 'c1',
        serviceName: 'LTE Failover',
        provider: 'Vodacom Business',
        accountNumber: 'VOD-998877',
        supportContact: '082 1940',
        portalUrl: 'https://www.vodacombusiness.co.za/login',
        notes: 'Sim card located in Huawei router in server room. APN: lte.vodacom.za',
        expiryDate: '2025-12-31',
        category: 'ISP'
    },
    {
        id: 'tps-2',
        clientId: 'c1',
        serviceName: 'Legacy PBX',
        provider: 'Telkom',
        accountNumber: 'TO-112233',
        supportContact: '10210',
        notes: 'Keep active until VoIP migration is 100% complete.',
        category: 'VoIP'
    },
    {
        id: 'tps-3',
        clientId: 'c2',
        serviceName: 'Cloud EMR Hosting',
        provider: 'Hetzner / xneelo',
        accountNumber: 'CUST-8821',
        supportContact: 'support@xneelo.co.za',
        notes: 'Managed by Dr. Nel directly. We only support connectivity to it.',
        category: 'Cloud'
    }
];