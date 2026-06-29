'use strict';

export const INDUSTRY_PROFILE_VERSION = 1;
export const DEFAULT_INDUSTRY_ID = 'technology';
export const GENERIC_INDUSTRY_ID = 'general';

const option = (value, label) => ({ value, label });

export const INDUSTRY_PROFILES = [
  {
    id: 'technology',
    name: 'Technology / Software',
    shortName: 'Technology',
    summary: 'Software, automation, AI workflows, internal tools, websites, and digital product delivery.',
    tone: 'confident, precise, commercially clear, implementation-aware',
    terminology: ['workflow', 'implementation', 'integration', 'QA', 'deployment', 'handoff', 'support'],
    questions: [
      {
        id: 'serviceFocus',
        label: 'What type of work will you propose most often?',
        required: true,
        options: [
          option('internal-systems', 'Internal systems and dashboards'),
          option('web-apps', 'Websites or web applications'),
          option('automation-ai', 'Automation and AI workflows'),
          option('support-retainers', 'Support or retainer work'),
        ],
      },
      {
        id: 'buyerType',
        label: 'Who usually approves the proposal?',
        required: true,
        options: [
          option('owner-founder', 'Owner, founder, or GM'),
          option('operations-team', 'Operations or department lead'),
          option('technical-team', 'Technical or IT stakeholder'),
          option('procurement', 'Procurement or finance team'),
        ],
      },
      {
        id: 'pricingModel',
        label: 'How should pricing be framed?',
        required: true,
        options: [
          option('fixed-scope', 'Fixed scope project'),
          option('milestone-package', 'Milestone package'),
          option('discovery-build', 'Discovery first, then build'),
          option('monthly-retainer', 'Monthly retainer'),
        ],
      },
    ],
    coreServices: ['Discovery and solution design', 'UX/UI and workflow planning', 'Development and integrations', 'QA, launch, and handoff', 'Post-launch support'],
    deliverables: ['Solution blueprint', 'Functional prototype or build', 'Admin workflows', 'Testing report', 'Training and support notes'],
    exclusions: ['Third-party subscription fees', 'Major scope changes after approval', 'Content/data cleanup not listed in scope', 'Hardware or on-site infrastructure'],
    milestones: ['Discovery and requirements', 'Design and architecture', 'Build and integration', 'QA and UAT', 'Launch and stabilization'],
    objections: [
      { question: 'How do we control scope?', answer: 'Use phased deliverables, written change requests, and approval checkpoints before new work starts.' },
      { question: 'How will non-technical staff adopt it?', answer: 'Include training, handoff notes, and a stabilization window after launch.' },
    ],
    toolkit: {
      template: {
        id: 'industry-technology-template',
        name: 'Technology / Software',
        summary: 'Digital product, website, automation, or internal system proposal with clear phases and support boundaries.',
        proposalName: 'Technology Services Proposal',
        notes: 'Use software delivery language only when the source scope supports it. Emphasize discovery, implementation, QA, launch readiness, access/security, support boundaries, and change control.',
        scopeItems: ['Discovery and workflow alignment', 'Implementation and integration planning', 'QA and user acceptance testing', 'Launch support and handoff'],
        priceItems: [
          { item: 'Discovery and solution design', basis: 'Workshops, requirements, and delivery plan', amount: 45000 },
          { item: 'Implementation package', basis: 'Core build and configuration', amount: 220000 },
          { item: 'QA, launch, and training', basis: 'Testing, deployment, and handoff', amount: 55000 },
        ],
      },
      pricingPackage: {
        id: 'industry-technology',
        name: 'Technology project',
        scopeItems: ['Discovery and workflow alignment', 'Core implementation', 'QA/UAT support', 'Launch handoff'],
        priceItems: [
          { item: 'Discovery and planning', basis: 'Fixed project phase', amount: 45000 },
          { item: 'Build and implementation', basis: 'Core delivery package', amount: 220000 },
          { item: 'Testing and launch support', basis: 'Release support', amount: 55000 },
        ],
      },
      blocks: [
        {
          id: 'industry-technology-scope-control',
          category: 'Industry: Technology',
          title: 'Technology Scope Control',
          body: 'New features, workflow changes, additional integrations, or revised approval flows will be treated as change requests with impact estimates for cost and timeline before implementation.',
        },
        {
          id: 'industry-technology-support',
          category: 'Industry: Technology',
          title: 'Launch Support Boundary',
          body: 'Post-launch support covers fixes and guidance for the delivered scope. New modules, major process changes, third-party platform changes, and data migration beyond the approved plan are quoted separately.',
        },
      ],
      defaultBlockIds: ['industry-technology-scope-control', 'industry-technology-support'],
    },
  },
  {
    id: 'marketing',
    name: 'Marketing / Creative Services',
    shortName: 'Marketing',
    summary: 'Campaigns, content, brand assets, digital marketing retainers, launch plans, and creative production.',
    tone: 'strategic, outcome-oriented, brand-aware, commercially direct',
    terminology: ['campaign', 'audience', 'creative direction', 'content calendar', 'conversion', 'brand consistency'],
    questions: [
      {
        id: 'serviceFocus',
        label: 'What service mix should proposals prioritize?',
        required: true,
        options: [
          option('campaigns', 'Campaign strategy and execution'),
          option('brand-content', 'Branding and content production'),
          option('paid-growth', 'Paid ads, SEO, or lead generation'),
          option('social-retainer', 'Social media or monthly retainer'),
        ],
      },
      {
        id: 'businessGoal',
        label: 'What result do clients usually want?',
        required: true,
        options: [
          option('lead-sales', 'More leads or sales'),
          option('brand-awareness', 'Brand awareness'),
          option('launch-support', 'Product or service launch'),
          option('retention', 'Retention and engagement'),
        ],
      },
      {
        id: 'pricingModel',
        label: 'How should pricing be framed?',
        required: true,
        options: [
          option('monthly-retainer', 'Monthly retainer'),
          option('campaign-package', 'Campaign package'),
          option('creative-production', 'Creative production package'),
          option('management-fee', 'Management fee plus ad budget'),
        ],
      },
    ],
    coreServices: ['Brand and campaign strategy', 'Content planning', 'Creative production', 'Channel execution', 'Performance reporting'],
    deliverables: ['Campaign plan', 'Messaging framework', 'Creative assets', 'Content calendar', 'Performance report'],
    exclusions: ['Media/ad spend unless stated', 'Talent, venue, or production rentals', 'Unlimited revisions', 'Guaranteed platform performance'],
    milestones: ['Discovery and strategy', 'Creative direction', 'Asset production', 'Campaign launch', 'Reporting and optimization'],
    objections: [
      { question: 'Can results be guaranteed?', answer: 'Performance targets can be defined, but platform behavior, budget, audience response, and market conditions affect results.' },
      { question: 'How are revisions handled?', answer: 'Include defined review rounds and quote major direction changes separately.' },
    ],
    toolkit: {
      template: {
        id: 'industry-marketing-template',
        name: 'Marketing / Creative',
        summary: 'Marketing proposal with goals, campaign scope, creative deliverables, channels, reporting, and revision limits.',
        proposalName: 'Marketing Services Proposal',
        notes: 'Frame around business goals, target audience, campaign strategy, deliverables, review rounds, launch cadence, reporting, and assumptions for media spend or third-party costs.',
        scopeItems: ['Campaign strategy and messaging', 'Creative asset production', 'Channel rollout plan', 'Performance reporting cadence'],
        priceItems: [
          { item: 'Strategy and campaign planning', basis: 'Audience, message, and channel plan', amount: 35000 },
          { item: 'Creative production', basis: 'Core assets and content package', amount: 90000 },
          { item: 'Launch and reporting', basis: 'Campaign execution and reporting', amount: 35000 },
        ],
      },
      pricingPackage: {
        id: 'industry-marketing',
        name: 'Marketing package',
        scopeItems: ['Defined campaign objective', 'Approved creative direction', 'Two revision rounds', 'Monthly report or closeout report'],
        priceItems: [
          { item: 'Strategy and planning', basis: 'Campaign setup', amount: 35000 },
          { item: 'Creative and content production', basis: 'Core deliverables', amount: 90000 },
          { item: 'Execution and reporting', basis: 'Launch support', amount: 35000 },
        ],
      },
      blocks: [
        {
          id: 'industry-marketing-revisions',
          category: 'Industry: Marketing',
          title: 'Creative Review Rounds',
          body: 'The proposal includes the stated number of review rounds. Major creative direction changes, new formats, or additional campaign assets after approval will be scoped separately.',
        },
        {
          id: 'industry-marketing-media-spend',
          category: 'Industry: Marketing',
          title: 'Media Spend Boundary',
          body: 'Advertising spend, influencer fees, production rentals, and third-party platform costs are excluded unless specifically listed in the approved budget.',
        },
      ],
      defaultBlockIds: ['industry-marketing-revisions', 'industry-marketing-media-spend'],
    },
  },
  {
    id: 'construction',
    name: 'Construction / Contracting',
    shortName: 'Construction',
    summary: 'Residential renovations, commercial fit-outs, build packages, maintenance scopes, and site-based project work.',
    tone: 'practical, risk-aware, clear on inclusions, timelines, materials, and site responsibilities',
    terminology: ['site inspection', 'materials', 'labor', 'permits', 'mobilization', 'turnover', 'variation order'],
    questions: [
      {
        id: 'projectType',
        label: 'What project type will you quote most?',
        required: true,
        options: [
          option('residential-renovation', 'Residential renovation'),
          option('commercial-fitout', 'Commercial fit-out'),
          option('new-build', 'New build or extension'),
          option('maintenance', 'Maintenance or repairs'),
        ],
      },
      {
        id: 'clientPriority',
        label: 'What does the client usually care about most?',
        required: true,
        options: [
          option('cost-control', 'Cost control'),
          option('timeline-certainty', 'Timeline certainty'),
          option('permits-compliance', 'Permits and compliance'),
          option('site-coordination', 'Site coordination and safety'),
        ],
      },
      {
        id: 'pricingModel',
        label: 'How should estimates be structured?',
        required: true,
        options: [
          option('labor-materials', 'Labor and materials split'),
          option('fixed-project', 'Fixed project package'),
          option('milestone-billing', 'Milestone billing'),
          option('site-survey-final', 'Initial estimate, final after site survey'),
        ],
      },
    ],
    coreServices: ['Site inspection', 'Scope and materials estimate', 'Labor planning', 'Project supervision', 'Turnover and punch list'],
    deliverables: ['Bill of quantities or estimate', 'Work schedule', 'Materials assumptions', 'Progress checkpoints', 'Turnover checklist'],
    exclusions: ['Permits unless stated', 'Hidden site conditions', 'Utility provider fees', 'Owner-supplied material delays', 'Variation orders'],
    milestones: ['Site inspection', 'Mobilization', 'Rough works', 'Finishing works', 'Punch list and turnover'],
    objections: [
      { question: 'What if hidden issues are discovered?', answer: 'Hidden conditions are documented and handled through a variation order before additional work proceeds.' },
      { question: 'Are permits included?', answer: 'Permits are included only when listed in scope; otherwise they remain a client responsibility or reimbursable cost.' },
    ],
    toolkit: {
      template: {
        id: 'industry-construction-template',
        name: 'Construction / Contracting',
        summary: 'Construction proposal with site assumptions, labor/material scope, exclusions, schedule, and variation order controls.',
        proposalName: 'Construction Services Proposal',
        notes: 'Use site-based language. Be explicit about inclusions, exclusions, materials assumptions, permit responsibilities, safety/site access, payment milestones, and variation orders.',
        scopeItems: ['Site inspection assumptions', 'Labor and material inclusions', 'Permit and utility responsibilities', 'Variation order control'],
        priceItems: [
          { item: 'Site inspection and planning', basis: 'Assessment and work plan', amount: 25000 },
          { item: 'Labor and materials package', basis: 'Core construction scope', amount: 280000 },
          { item: 'Supervision and turnover', basis: 'Project management and punch list', amount: 45000 },
        ],
      },
      pricingPackage: {
        id: 'industry-construction',
        name: 'Construction package',
        scopeItems: ['Final quote subject to site validation', 'Permits excluded unless listed', 'Hidden conditions handled by variation order', 'Turnover includes punch list review'],
        priceItems: [
          { item: 'Site assessment and planning', basis: 'Inspection and estimate preparation', amount: 25000 },
          { item: 'Labor and materials', basis: 'Approved scope of work', amount: 280000 },
          { item: 'Supervision and turnover', basis: 'Project management', amount: 45000 },
        ],
      },
      blocks: [
        {
          id: 'industry-construction-hidden-conditions',
          category: 'Industry: Construction',
          title: 'Hidden Site Conditions',
          body: 'Costs and timelines may be adjusted if hidden site conditions, structural issues, utility conflicts, or owner-supplied material delays are discovered after mobilization.',
        },
        {
          id: 'industry-construction-variation-orders',
          category: 'Industry: Construction',
          title: 'Variation Orders',
          body: 'Work outside the approved scope requires a written variation order covering added cost, schedule impact, and revised deliverables before execution.',
        },
      ],
      defaultBlockIds: ['industry-construction-hidden-conditions', 'industry-construction-variation-orders'],
    },
  },
  {
    id: 'consulting',
    name: 'Business Consulting / Professional Services',
    shortName: 'Consulting',
    summary: 'Strategy, operations, finance, compliance, training, workshops, and advisory engagements.',
    tone: 'advisory, executive-friendly, evidence-based, focused on outcomes and decision clarity',
    terminology: ['diagnostic', 'stakeholder interviews', 'recommendations', 'implementation roadmap', 'workshop', 'change management'],
    questions: [
      {
        id: 'advisoryFocus',
        label: 'What consulting work should proposals support?',
        required: true,
        options: [
          option('strategy', 'Strategy and growth'),
          option('operations', 'Operations and process improvement'),
          option('finance-compliance', 'Finance, compliance, or risk'),
          option('training-change', 'Training and change management'),
        ],
      },
      {
        id: 'engagementModel',
        label: 'What engagement model do you use most?',
        required: true,
        options: [
          option('diagnostic-sprint', 'Diagnostic sprint'),
          option('workshops', 'Workshop series'),
          option('implementation-support', 'Implementation support'),
          option('retainer', 'Monthly advisory retainer'),
        ],
      },
      {
        id: 'successMetric',
        label: 'What success metric matters most?',
        required: true,
        options: [
          option('cost-reduction', 'Cost reduction'),
          option('revenue-growth', 'Revenue growth'),
          option('compliance-readiness', 'Compliance readiness'),
          option('team-capability', 'Team capability'),
        ],
      },
    ],
    coreServices: ['Stakeholder interviews', 'Current-state assessment', 'Recommendations', 'Implementation roadmap', 'Workshops and advisory support'],
    deliverables: ['Diagnostic report', 'Executive recommendations', 'Roadmap', 'Workshop materials', 'Decision log'],
    exclusions: ['Client operational execution unless stated', 'Legal or audit opinion', 'Guaranteed financial outcomes', 'Third-party implementation costs'],
    milestones: ['Kickoff and data request', 'Discovery interviews', 'Analysis and findings', 'Recommendations workshop', 'Final roadmap'],
    objections: [
      { question: 'Will the consultant implement the recommendations?', answer: 'Implementation support can be included, but client-side execution responsibilities should be stated clearly.' },
      { question: 'Are outcomes guaranteed?', answer: 'The engagement defines deliverables and decision support; business outcomes depend on execution, market conditions, and client adoption.' },
    ],
    toolkit: {
      template: {
        id: 'industry-consulting-template',
        name: 'Business Consulting',
        summary: 'Advisory proposal with diagnostic scope, workshops, executive outputs, roadmap, and decision support.',
        proposalName: 'Consulting Services Proposal',
        notes: 'Frame around business problem, decision goals, stakeholder inputs, diagnostic method, workshops, recommendations, roadmap, client responsibilities, and outcome assumptions.',
        scopeItems: ['Stakeholder interviews and discovery', 'Current-state assessment', 'Recommendations workshop', 'Roadmap and handoff'],
        priceItems: [
          { item: 'Diagnostic sprint', basis: 'Discovery, interviews, and analysis', amount: 60000 },
          { item: 'Recommendations and roadmap', basis: 'Executive report and workshop', amount: 95000 },
          { item: 'Implementation advisory', basis: 'Guided follow-through support', amount: 45000 },
        ],
      },
      pricingPackage: {
        id: 'industry-consulting',
        name: 'Consulting package',
        scopeItems: ['Defined stakeholder group', 'Client data provided on time', 'Recommendations are advisory unless implementation is included', 'Workshop attendance required'],
        priceItems: [
          { item: 'Discovery and diagnostic', basis: 'Interviews and assessment', amount: 60000 },
          { item: 'Report and roadmap', basis: 'Recommendations package', amount: 95000 },
          { item: 'Advisory support', basis: 'Implementation guidance', amount: 45000 },
        ],
      },
      blocks: [
        {
          id: 'industry-consulting-client-inputs',
          category: 'Industry: Consulting',
          title: 'Client Inputs',
          body: 'The client will provide timely access to stakeholders, relevant records, baseline metrics, and decision-makers. Delays in inputs may affect the timeline.',
        },
        {
          id: 'industry-consulting-advisory-boundary',
          category: 'Industry: Consulting',
          title: 'Advisory Boundary',
          body: 'Recommendations are advisory unless implementation support is explicitly included. Legal, audit, tax, or regulatory opinions are excluded unless provided by qualified specialists.',
        },
      ],
      defaultBlockIds: ['industry-consulting-client-inputs', 'industry-consulting-advisory-boundary'],
    },
  },
  {
    id: 'events',
    name: 'Events / Hospitality',
    shortName: 'Events',
    summary: 'Corporate events, private celebrations, conferences, activations, vendor coordination, and event production.',
    tone: 'organized, experience-led, logistics-aware, clear on vendor responsibilities and guest experience',
    terminology: ['run of show', 'vendor coordination', 'guest experience', 'production schedule', 'venue logistics', 'contingency plan'],
    questions: [
      {
        id: 'eventType',
        label: 'What event type will you propose most?',
        required: true,
        options: [
          option('corporate', 'Corporate event'),
          option('conference', 'Conference or seminar'),
          option('wedding-private', 'Wedding or private event'),
          option('brand-activation', 'Brand activation'),
        ],
      },
      {
        id: 'serviceScope',
        label: 'What scope should proposals emphasize?',
        required: true,
        options: [
          option('planning-coordination', 'Planning and coordination'),
          option('production-vendors', 'Production and vendor management'),
          option('venue-logistics', 'Venue and logistics'),
          option('full-service', 'Full-service event management'),
        ],
      },
      {
        id: 'pricingModel',
        label: 'How should pricing be framed?',
        required: true,
        options: [
          option('package-addons', 'Package plus add-ons'),
          option('management-fee', 'Management fee'),
          option('per-attendee', 'Per attendee'),
          option('milestone-payments', 'Milestone payments'),
        ],
      },
    ],
    coreServices: ['Event planning', 'Supplier coordination', 'Production scheduling', 'On-site management', 'Post-event closeout'],
    deliverables: ['Event concept', 'Run of show', 'Vendor matrix', 'Production schedule', 'Budget tracker'],
    exclusions: ['Venue fees unless stated', 'Supplier deposits', 'Guest travel and accommodation', 'Force majeure costs', 'Client-requested upgrades'],
    milestones: ['Concept and planning', 'Supplier booking', 'Production coordination', 'Event day management', 'Closeout report'],
    objections: [
      { question: 'What happens if suppliers change pricing?', answer: 'Supplier fees are confirmed separately and may change until deposits or purchase orders are issued.' },
      { question: 'Who handles on-site issues?', answer: 'On-site coordination can be included with clear authority, escalation contacts, and contingency responsibilities.' },
    ],
    toolkit: {
      template: {
        id: 'industry-events-template',
        name: 'Events / Hospitality',
        summary: 'Event proposal with guest experience, vendor responsibilities, production schedule, budget assumptions, and contingency notes.',
        proposalName: 'Event Services Proposal',
        notes: 'Frame around event objective, guest experience, venue/vendor responsibilities, run of show, production schedule, payment milestones, exclusions, and contingency assumptions.',
        scopeItems: ['Event concept and planning', 'Vendor and venue coordination', 'Run of show and production schedule', 'On-site management assumptions'],
        priceItems: [
          { item: 'Planning and concept development', basis: 'Event brief and coordination plan', amount: 30000 },
          { item: 'Vendor and production coordination', basis: 'Supplier management and scheduling', amount: 85000 },
          { item: 'Event day management', basis: 'On-site coordination and closeout', amount: 45000 },
        ],
      },
      pricingPackage: {
        id: 'industry-events',
        name: 'Event package',
        scopeItems: ['Venue and supplier fees excluded unless listed', 'Guest count changes may affect final cost', 'On-site authority and escalation contacts required', 'Force majeure handled separately'],
        priceItems: [
          { item: 'Planning and concept', basis: 'Event brief and run of show', amount: 30000 },
          { item: 'Vendor coordination', basis: 'Supplier and production management', amount: 85000 },
          { item: 'Event day management', basis: 'On-site coordination', amount: 45000 },
        ],
      },
      blocks: [
        {
          id: 'industry-events-supplier-costs',
          category: 'Industry: Events',
          title: 'Supplier Cost Boundary',
          body: 'Venue charges, supplier fees, rentals, permits, guest travel, and third-party deposits are excluded unless specifically included in the approved budget.',
        },
        {
          id: 'industry-events-guest-count',
          category: 'Industry: Events',
          title: 'Guest Count Changes',
          body: 'Changes in guest count, venue requirements, or program flow may affect staffing, supplier costs, production schedule, and final pricing.',
        },
      ],
      defaultBlockIds: ['industry-events-supplier-costs', 'industry-events-guest-count'],
    },
  },
];

export const GENERIC_INDUSTRY_PROFILE = {
  id: GENERIC_INDUSTRY_ID,
  name: 'General Services',
  shortName: 'General',
  summary: 'Safe fallback for professional services proposals when no industry profile is available.',
  tone: 'clear, professional, practical, and commercially transparent',
  terminology: ['scope', 'deliverables', 'timeline', 'assumptions', 'payment terms', 'support'],
  questions: [],
  coreServices: ['Discovery', 'Service delivery', 'Review and handoff', 'Support'],
  deliverables: ['Scope summary', 'Deliverables list', 'Timeline', 'Pricing table', 'Terms'],
  exclusions: ['Work outside agreed scope', 'Third-party fees unless stated', 'Major revisions after approval'],
  milestones: ['Kickoff', 'Delivery', 'Review', 'Final handoff'],
  objections: [
    { question: 'How is scope managed?', answer: 'Clarify inclusions, exclusions, and change request handling before work starts.' },
  ],
  toolkit: {
    template: null,
    pricingPackage: null,
    blocks: [],
    defaultBlockIds: [],
  },
};

const escapeHtml = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export function getIndustryProfile(industryId) {
  return INDUSTRY_PROFILES.find((profile) => profile.id === industryId) || null;
}

export function getIndustryProfileOrFallback(industryId) {
  return getIndustryProfile(industryId) || GENERIC_INDUSTRY_PROFILE;
}

export function industryOptionsHtml(selectedId = DEFAULT_INDUSTRY_ID, { includePlaceholder = false } = {}) {
  const placeholder = includePlaceholder
    ? `<option value=""${selectedId ? '' : ' selected'} disabled>Choose your industry</option>`
    : '';
  return placeholder + INDUSTRY_PROFILES.map((profile) => (
    `<option value="${escapeHtml(profile.id)}"${profile.id === selectedId ? ' selected' : ''}>${escapeHtml(profile.name)}</option>`
  )).join('');
}

export function industryQuestionsHtml(industryId = DEFAULT_INDUSTRY_ID, answers = {}, fieldPrefix = 'industryQuestion') {
  const profile = getIndustryProfile(industryId);
  if (!profile) return '<p class="card__hint">Choose an industry to see the setup questions.</p>';
  if (!profile.questions.length) return '<p class="card__hint">No extra setup questions are required for this profile.</p>';
  return profile.questions.map((question) => {
    const current = answers[question.id] || '';
    const fieldId = `${fieldPrefix}_${question.id}`;
    const options = [
      '<option value="">Choose one</option>',
      ...question.options.map((item) => (
        `<option value="${escapeHtml(item.value)}"${item.value === current ? ' selected' : ''}>${escapeHtml(item.label)}</option>`
      )),
    ].join('');
    return `
      <div class="industry-question">
        <label class="label" for="${escapeHtml(fieldId)}">${escapeHtml(question.label)}</label>
        <select id="${escapeHtml(fieldId)}" class="input" data-industry-question="${escapeHtml(question.id)}" ${question.required ? 'required' : ''}>
          ${options}
        </select>
      </div>
    `;
  }).join('');
}

export function collectIndustryAnswers(root = document) {
  const answers = {};
  root.querySelectorAll('[data-industry-question]').forEach((input) => {
    const key = input.dataset.industryQuestion;
    if (!key) return;
    const value = String(input.value || '').trim();
    if (value) answers[key] = value;
  });
  return answers;
}

export function buildIndustryMetadata(industryId = DEFAULT_INDUSTRY_ID, answers = {}) {
  const profile = getIndustryProfile(industryId) || getIndustryProfile(DEFAULT_INDUSTRY_ID);
  const cleanAnswers = {};
  profile.questions.forEach((question) => {
    const value = String(answers[question.id] || '').trim();
    if (value) cleanAnswers[question.id] = value;
  });
  const metadata = {
    industryId: profile.id,
    answers: cleanAnswers,
    version: INDUSTRY_PROFILE_VERSION,
  };
  if (areIndustryAnswersComplete(profile, cleanAnswers)) metadata.completedAt = new Date().toISOString();
  return metadata;
}

export function normalizeIndustryMetadata(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const industryId = raw.industryId || raw.industry_id || raw.id;
  const profile = getIndustryProfile(industryId);
  if (!profile) return null;
  const answers = raw.answers && typeof raw.answers === 'object' ? raw.answers : {};
  const metadata = {
    industryId: profile.id,
    answers,
    version: Number(raw.version || INDUSTRY_PROFILE_VERSION),
  };
  if (raw.completedAt || raw.completed_at) metadata.completedAt = raw.completedAt || raw.completed_at;
  return metadata;
}

export function areIndustryAnswersComplete(profile, answers = {}) {
  if (!profile || !Array.isArray(profile.questions)) return false;
  return profile.questions.every((question) => !question.required || Boolean(String(answers[question.id] || '').trim()));
}

export function isIndustryMetadataComplete(metadata) {
  const normalized = normalizeIndustryMetadata(metadata);
  if (!normalized) return false;
  return areIndustryAnswersComplete(getIndustryProfile(normalized.industryId), normalized.answers);
}

export function getIndustryTemplates() {
  return INDUSTRY_PROFILES.map((profile) => profile.toolkit.template).filter(Boolean);
}

export function getIndustryContentBlocks() {
  return INDUSTRY_PROFILES.flatMap((profile) => profile.toolkit.blocks || []);
}

export function getIndustryPricingPackages() {
  return INDUSTRY_PROFILES.map((profile) => profile.toolkit.pricingPackage).filter(Boolean);
}

export function formatIndustryAnswers(industryId, answers = {}) {
  const profile = getIndustryProfileOrFallback(industryId);
  return profile.questions.reduce((memo, question) => {
    const rawValue = answers[question.id];
    if (!rawValue) return memo;
    const selected = question.options.find((item) => item.value === rawValue);
    memo[question.label] = selected ? selected.label : rawValue;
    return memo;
  }, {});
}

export function getIndustryPromptContext(metadata) {
  const normalized = normalizeIndustryMetadata(metadata);
  const profile = getIndustryProfileOrFallback(normalized && normalized.industryId);
  return {
    industryId: profile.id,
    industryName: profile.name,
    summary: profile.summary,
    tone: profile.tone,
    terminology: profile.terminology,
    onboardingComplete: Boolean(normalized && isIndustryMetadataComplete(normalized)),
    onboardingAnswers: normalized ? formatIndustryAnswers(profile.id, normalized.answers) : {},
    coreServices: profile.coreServices,
    commonDeliverables: profile.deliverables,
    commonExclusions: profile.exclusions,
    typicalMilestones: profile.milestones,
    commonObjections: profile.objections,
    pricingAssumptions: profile.toolkit.pricingPackage ? profile.toolkit.pricingPackage.priceItems : [],
    fallbackInstruction: normalized ? '' : 'No completed industry onboarding was found. Use this as safe generic context and avoid over-specializing claims.',
  };
}
