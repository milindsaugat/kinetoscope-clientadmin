/* ============================================================
   Data: mockData.js (client-admin)
   Description: Cleaned configuration & formatters re-exports
   ============================================================ */

export { formatCurrency, formatNumber } from '../utils/formatters';

export const mockClient = {};
export const mockJourney = {
  accountCreated: true,
  onboardingComplete: false,
  kycSubmitted: false,
  agreementSigned: false,
  firstInvestment: false,
  roiConfigured: false,
  firstRoiReceived: false,
};
export const mockInvestments = [];
export const mockTotalInvested = 0;
export const mockROIHistory = [];
export const mockDividendBonus = null;
export const mockPerks = { currentTier: 'Silver', nextTierAmount: 0, history: [] };
export const mockServiceRequests = [];
export const mockPaymentRequests = [];
export const mockStats = {
  totalInvested: 0,
  monthlyROI: 0,
  roiRate: 0,
  perkTier: 'Silver',
  nextROIDate: '—',
};

export const mockServiceRequestDetail = null;
export const mockPortfolioProjects = [];
export const mockOpportunities = [];
export const mockMedia = [];
export const mockFAQs = [];
