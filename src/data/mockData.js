/* ============================================================
   Data: mockData.js
   Description: Comprehensive mock data for all client portal modules
   ============================================================ */

/* ── Client Profile ─────────────────────── */
export const mockClient = {
  id: 1,
  clientId: 'KFPL-1042',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@email.com',
  phone: '+91 98765 43210',
  dob: '1985-03-15',
  address: '42, Green Valley Apartments, Andheri West, Mumbai 400058',
  category: 'Premium',
  status: 'Active',
  memberSince: '2024-08-15',
  onboardingComplete: true,
  agentName: 'Vikram Patel',
  agentId: 'AGT-007',
  emergencyContact: '+91 87654 32109',
  nominee: {
    name: 'Priya Sharma',
    relation: 'Spouse',
    contact: '9876543211',
    email: 'priya.sharma@email.com',
  },
  riskProfile: 'moderate',
  riskProfileLocked: true,
  agentCommission: {
    oneTimePercent: 2,
    monthlyPercent: 0.75,
    specialPercent: 0,
    totalPaid: 157500,
    history: [
      { id: 1, month: 'Jan 2025', date: '2025-01-31', amount: 3750, status: 'Paid' },
      { id: 2, month: 'Feb 2025', date: '2025-02-28', amount: 3750, status: 'Paid' },
      { id: 3, month: 'Mar 2025', date: '2025-03-31', amount: 3750, status: 'Paid' },
      { id: 4, month: 'Apr 2025', date: '2025-04-30', amount: 3750, status: 'Paid' },
      { id: 5, month: 'May 2025', date: '2025-05-31', amount: 3750, status: 'Paid' },
      { id: 6, month: 'Jun 2025', date: '2025-06-30', amount: 3750, status: 'Pending' },
      { id: 7, month: 'Onboarding', date: '2024-08-15', amount: 120000, type: 'one-time', status: 'Paid' },
    ],
  },
};

/* ── Journey Progress ─────────────────────── */
export const mockJourney = {
  accountCreated: true,
  onboardingComplete: true,
  kycSubmitted: true,
  agreementSigned: true,
  firstInvestment: true,
  roiConfigured: true,
  firstRoiReceived: false,
};

/* ── Investment Data ─────────────────────── */
export const mockInvestments = [
  { id: 1, segment: 'Film Making', amount: 2500000, date: '2024-09-01', contractPeriod: '24 months', status: 'Active', roiAllocated: 15, roiReceived: 12.5 },
  { id: 2, segment: 'Distribution', amount: 1500000, date: '2024-10-15', contractPeriod: '18 months', status: 'Active', roiAllocated: 12, roiReceived: 10 },
  { id: 3, segment: 'Music', amount: 800000, date: '2025-01-10', contractPeriod: '12 months', status: 'Active', roiAllocated: 10, roiReceived: 8 },
  { id: 4, segment: 'Content IP Bank', amount: 1200000, date: '2025-03-20', contractPeriod: '24 months', status: 'Active', roiAllocated: 14, roiReceived: 0 },
];

export const mockTotalInvested = 6000000;

/* ── ROI History ─────────────────────── */
export const mockROIHistory = [
  { month: 'Jan 2025', expected: 75000, received: 75000, date: '2025-01-28', status: 'Paid' },
  { month: 'Feb 2025', expected: 75000, received: 75000, date: '2025-02-28', status: 'Paid' },
  { month: 'Mar 2025', expected: 75000, received: 75000, date: '2025-03-28', status: 'Paid' },
  { month: 'Apr 2025', expected: 82000, received: 82000, date: '2025-04-28', status: 'Paid' },
  { month: 'May 2025', expected: 82000, received: 82000, date: '2025-05-28', status: 'Paid' },
  { month: 'Jun 2025', expected: 82000, received: 0, date: '2025-06-28', status: 'Pending' },
];

/* ── Dividend Bonus ─────────────────────── */
export const mockDividendBonus = {
  amount: 150000,
  segment: 'Film Making',
  project: 'Project Vanguard',
  creditDate: '2025-04-15',
  adminNote: 'Annual performance bonus for exceptional project returns.',
};

/* ── Perks ─────────────────────── */
export const mockPerks = {
  currentTier: 'Gold',
  nextTierAmount: 900000,
  history: [
    { date: '2024-08-15', event: 'Joined KFPL — Silver tier assigned', type: 'tier' },
    { date: '2024-11-01', event: 'Upgraded to Gold tier — ₹5L+ invested', type: 'tier' },
    { date: '2025-01-15', event: 'Priority support activated', type: 'perk' },
    { date: '2025-03-01', event: 'Quarterly review call completed', type: 'perk' },
    { date: '2025-04-15', event: 'Early access to Project Horizon granted', type: 'perk' },
  ],
};

/* ── Service Requests ─────────────────────── */
export const mockServiceRequests = [
  { id: 'SR-001', category: 'Investment Query', subject: 'ROI calculation clarification for Q1', date: '2025-05-10', status: 'Resolved' },
  { id: 'SR-002', category: 'Document Request', subject: 'Updated agreement copy needed', date: '2025-05-25', status: 'In Progress' },
  { id: 'SR-003', category: 'Payment Issue', subject: 'May ROI not credited yet', date: '2025-06-05', status: 'Open' },
];

export const mockServiceRequestDetail = {
  id: 'SR-003',
  category: 'Payment Issue',
  subject: 'May ROI not credited yet',
  description: 'My May 2025 ROI of ₹82,000 has not been credited to my account as of June 5th. The expected payment date was May 28th. Please look into this urgently.',
  date: '2025-06-05',
  status: 'Open',
  timeline: [
    { date: '2025-06-05 10:30 AM', text: 'Request submitted by client', type: 'client' },
    { date: '2025-06-05 02:15 PM', text: 'Request acknowledged — assigned to finance team', type: 'admin' },
  ],
  adminNotes: 'Payment processing delayed due to bank holiday. Expected credit by June 10.',
};

/* ── Portfolio Projects ─────────────────────── */
export const mockPortfolioProjects = [
  { id: 1, name: 'Project Vanguard', segment: 'Film Making', status: 'In Production', milestone: 75, value: '₹4.5 Cr', team: 'A-list cast' },
  { id: 2, name: 'Rhythm Nation', segment: 'Music', status: 'Released', milestone: 100, value: '₹1.2 Cr', team: '5 albums' },
  { id: 3, name: 'CineDistro Global', segment: 'Distribution', status: 'Active', milestone: 60, value: '₹8 Cr', team: '12 titles' },
  { id: 4, name: 'IP Vault Alpha', segment: 'Content IP Bank', status: 'Acquiring', milestone: 40, value: '₹2.5 Cr', team: '30 IPs' },
  { id: 5, name: 'TradeSync', segment: 'Trading & Syndication', status: 'Active', milestone: 55, value: '₹3 Cr', team: '8 deals' },
  { id: 6, name: 'ScreenX Cinemas', segment: 'Film Exhibition', status: 'Planned', milestone: 20, value: '₹6 Cr', team: '3 locations' },
];

/* ── Open Opportunities ─────────────────────── */
export const mockOpportunities = [
  { id: 1, name: 'Project Horizon', segment: 'Film Making', minInvestment: 500000, slotsAvailable: 5, totalSlots: 20, riskReward: 'Medium / 14% ROI', status: 'Open' },
  { id: 2, name: 'Music Label Alpha', segment: 'Music', minInvestment: 200000, slotsAvailable: 0, totalSlots: 15, riskReward: 'Low / 10% ROI', status: 'Slot Full' },
  { id: 3, name: 'CineDistro Phase 2', segment: 'Distribution', minInvestment: 1000000, slotsAvailable: 8, totalSlots: 10, riskReward: 'Medium / 12% ROI', status: 'Open' },
  { id: 4, name: 'IP Vault Beta', segment: 'Content IP Bank', minInvestment: 300000, slotsAvailable: 12, totalSlots: 25, riskReward: 'Low / 11% ROI', status: 'Open' },
];

/* ── Payment Requests ─────────────────────── */
export const mockPaymentRequests = [
  { id: 1, type: 'Deposit', amount: 500000, date: '2025-04-10', status: 'Approved', mode: 'Bank Transfer', note: 'Additional investment' },
  { id: 2, type: 'Withdrawal', amount: 200000, date: '2025-05-20', status: 'Pending', mode: 'Bank Transfer', note: 'Personal requirement' },
  { id: 3, type: 'Deposit', amount: 1000000, date: '2025-03-01', status: 'Approved', mode: 'NEFT', note: 'New project investment' },
];

/* ── Media / Blog ─────────────────────── */
export const mockMedia = [
  { id: 1, title: 'KFPL Announces Record Q1 Returns for Investors', category: 'Company News', date: '2025-06-01', excerpt: 'Kross Film Productions Ltd. has announced record quarterly returns for its investor portfolio, with an average ROI of 14.2% across all segments.' },
  { id: 2, title: 'Project Vanguard Enters Post-Production Phase', category: 'Project Updates', date: '2025-05-25', excerpt: 'The flagship film making project has completed principal photography and entered the post-production phase, on track for a Q4 release.' },
  { id: 3, title: 'Understanding Film Investment Risk Profiles', category: 'Industry News', date: '2025-05-15', excerpt: 'A comprehensive guide to understanding different risk profiles in entertainment industry investments and how they affect your portfolio.' },
  { id: 4, title: 'New Distribution Partnership with StreamGlobal', category: 'Press Release', date: '2025-05-10', excerpt: 'KFPL has signed a strategic distribution partnership with StreamGlobal, opening new revenue streams for content distribution investors.' },
  { id: 5, title: 'Perk Tier Updates: Diamond Benefits Expanded', category: 'Company News', date: '2025-04-28', excerpt: 'Diamond tier investors now enjoy expanded benefits including VIP concierge service and exclusive film premiere invitations.' },
  { id: 6, title: 'Music Label Alpha: First Quarter Revenue Report', category: 'Project Updates', date: '2025-04-20', excerpt: 'Our music vertical reports strong first quarter performance with 5 album releases generating significant streaming revenue.' },
];

/* ── Client Stats (Dashboard KPIs) ─────────────────────── */
export const mockStats = {
  totalInvested: 6000000,
  monthlyROI: 82000,
  roiRate: 13.5,
  perkTier: 'Gold',
  nextROIDate: '2025-06-28',
};

/* ── FAQ Data ─────────────────────── */
export const mockFAQs = [
  { q: 'How is my ROI calculated?', a: 'Your ROI is calculated based on the allocated percentage for each investment segment. The rate is applied to your principal amount and credited monthly.' },
  { q: 'Can I withdraw my investment before the contract period?', a: 'Early withdrawal is subject to admin approval and may incur a processing fee. Please raise a Service Request or contact support for assistance.' },
  { q: 'How do I change my risk profile?', a: 'Risk profile can only be changed once after initial selection. Submit a Service Request under "Risk Profile Change" category and our team will review it.' },
  { q: 'What are the perk tier thresholds?', a: 'Silver: ₹0-5L, Gold: ₹5L-15L, Platinum: ₹15L-50L, Diamond: ₹50L+. Tiers are automatically updated based on your total investment.' },
  { q: 'How do I update my nominee details?', a: 'Go to Profile → Nominee Details card and click Edit. You can update nominee information at any time.' },
];

// ── Utility: Format Currency ───────────────────────
export function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ── Utility: Format Number ───────────────────────
export function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

/* ============ END: mockData.js ============ */
